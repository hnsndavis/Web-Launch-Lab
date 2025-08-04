import { pool } from '../../../lib/database.js';
import ghl from '../../../lib/ghl.js';
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

    // Create contact in GHL first
    const ghlContact = await ghl.createContact({
      email,
      phone: phone || '',
      firstName: name ? name.split(' ')[0] : '',
      lastName: name ? name.split(' ').slice(1).join(' ') : '',
      customFields: {
        company: company || '',
        source: source || 'website'
      }
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
      INSERT INTO leads (ghl_contact_id, email, phone, name, company, source, score, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
      ON CONFLICT (ghl_contact_id) DO UPDATE SET
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
      ghlContact.contact?.id || ghlContact.id,
      email,
      phone || null,
      name || '',
      company || '',
      source || 'website',
      score
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

      // TODO: Queue email for sending via GHL workflow
      console.log('Generated personalized follow-up:', personalizedEmail);
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