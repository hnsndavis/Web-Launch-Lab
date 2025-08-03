const { pool } = require('../../../lib/database');
const ghl = require('../../../lib/ghl');
const claude = require('../../../lib/claude');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;
    
    switch (type) {
      case 'contact.created':
        await handleNewLead(data);
        break;
        
      case 'contact.updated':
        await handleLeadUpdate(data);
        break;
        
      case 'opportunity.stage_changed':
        await handleStageChange(data);
        break;
        
      default:
        console.log('Unhandled webhook type:', type);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleNewLead(contactData) {
  try {
    // Score the lead using Claude
    const score = await claude.scoreLeadQuality({
      industry: contactData.customFields?.industry || 'Unknown',
      companySize: contactData.customFields?.companySize,
      hasWebsite: contactData.customFields?.hasWebsite === 'true',
      budgetRange: contactData.customFields?.budget,
      engagementLevel: 'New',
      source: contactData.source || 'Unknown'
    });

    // Store in database
    const query = `
      INSERT INTO leads (ghl_contact_id, email, phone, name, company, industry, source, score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (ghl_contact_id) DO UPDATE SET
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        industry = EXCLUDED.industry,
        source = EXCLUDED.source,
        score = EXCLUDED.score,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;

    const values = [
      contactData.id,
      contactData.email,
      contactData.phone,
      contactData.firstName + ' ' + (contactData.lastName || ''),
      contactData.customFields?.company || '',
      contactData.customFields?.industry || 'Unknown',
      contactData.source || 'Unknown',
      score
    ];

    const result = await pool.query(query, values);
    
    // If high-score lead, trigger priority workflow
    if (score >= 80) {
      await ghl.triggerWorkflow(contactData.id, process.env.HIGH_PRIORITY_WORKFLOW_ID);
    }
    
    console.log('New lead processed:', contactData.email, 'Score:', score);
  } catch (error) {
    console.error('Error handling new lead:', error);
  }
}

async function handleLeadUpdate(contactData) {
  try {
    const query = `
      UPDATE leads 
      SET email = $2, phone = $3, name = $4, company = $5, updated_at = CURRENT_TIMESTAMP
      WHERE ghl_contact_id = $1
    `;

    const values = [
      contactData.id,
      contactData.email,
      contactData.phone,
      contactData.firstName + ' ' + (contactData.lastName || ''),
      contactData.customFields?.company || ''
    ];

    await pool.query(query, values);
    console.log('Lead updated:', contactData.email);
  } catch (error) {
    console.error('Error updating lead:', error);
  }
}

async function handleStageChange(opportunityData) {
  try {
    // Update lead status based on pipeline stage
    let status = 'contacted';
    
    switch (opportunityData.pipelineStageId) {
      case process.env.GHL_QUALIFIED_STAGE_ID:
        status = 'qualified';
        break;
      case process.env.GHL_PROPOSAL_STAGE_ID:
        status = 'proposal';
        break;
      case process.env.GHL_WON_STAGE_ID:
        status = 'won';
        // Trigger project creation workflow
        await createProjectFromWonLead(opportunityData);
        break;
      case process.env.GHL_LOST_STAGE_ID:
        status = 'lost';
        break;
    }

    const query = `UPDATE leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE ghl_contact_id = $2`;
    await pool.query(query, [status, opportunityData.contactId]);
    
    console.log('Lead status updated:', opportunityData.contactId, status);
  } catch (error) {
    console.error('Error handling stage change:', error);
  }
}

async function createProjectFromWonLead(opportunityData) {
  try {
    // Get lead data
    const leadQuery = `SELECT * FROM leads WHERE ghl_contact_id = $1`;
    const leadResult = await pool.query(leadQuery, [opportunityData.contactId]);
    
    if (leadResult.rows.length === 0) return;
    
    const lead = leadResult.rows[0];
    
    // Create project
    const projectQuery = `
      INSERT INTO projects (lead_id, name, status, setup_fee, monthly_fee)
      VALUES ($1, $2, 'pending', 497.00, 49.00)
      RETURNING id
    `;
    
    const projectName = `${lead.company || lead.name} Website`;
    const projectResult = await pool.query(projectQuery, [lead.id, projectName]);
    
    // TODO: Trigger automated project setup workflow
    console.log('Project created for won lead:', projectName);
  } catch (error) {
    console.error('Error creating project from won lead:', error);
  }
}