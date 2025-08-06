import { pool } from '../../../lib/database.js';
import hubspot from '../../../lib/hubspot.js';
import claude from '../../../lib/claude.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone, name, company, source } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Create lead with deal in HubSpot
    const hubspotResult = await hubspot.createLeadWithDeal({
      email,
      phone: phone || '',
      name: name || '',
      company: company || '',
      source: source || 'website',
      amount: '', // Will be filled in later during qualification
      stage: 'appointmentscheduled' // First stage in default pipeline
    });

    // Score the lead
    const score = await claude.scoreLeadQuality({
      industry: 'Unknown',
      hasWebsite: false,
      engagementLevel: 'New',
      source: source || 'website'
    });

    // Store in our database
    const query = `
      INSERT INTO leads (hubspot_contact_id, hubspot_deal_id, email, phone, name, company, source, score, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'new')
      ON CONFLICT (hubspot_contact_id) DO UPDATE SET
        hubspot_deal_id = EXCLUDED.hubspot_deal_id,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        source = EXCLUDED.source,
        score = EXCLUDED.score,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;

    const values = [
      hubspotResult.contact.id,
      hubspotResult.deal.id,
      email,
      phone || null,
      name || '',
      company || '',
      source || 'website',
      score,
    ];

    const result = await pool.query(query, values);

    // Generate personalized follow-up email
    if (name && company) {
      const personalizedEmail = await claude.generatePersonalizedOutreach({
        name,
        company,
        industry: 'Unknown',
        source: source || 'website'
      });

      // Add note to HubSpot deal with personalized follow-up
      await hubspot.addNote('deal', hubspotResult.deal.id, `Personalized follow-up: ${personalizedEmail}`);
    }

    res.status(200).json({ 
      success: true, 
      leadId: result.rows[0].id,
      score 
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
}