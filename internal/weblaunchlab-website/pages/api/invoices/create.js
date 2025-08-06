import { pool } from '../../../lib/database.js';
import hubspot from '../../../lib/hubspot.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      dealId, 
      leadId, 
      amount, 
      description, 
      customerEmail, 
      customerName,
      dueDate 
    } = req.body;

    if (!amount || !customerEmail) {
      return res.status(400).json({ error: 'Amount and customer email are required' });
    }

    // Create invoice in database
    const invoiceQuery = `
      INSERT INTO invoices (
        lead_id, 
        hubspot_deal_id, 
        amount, 
        description, 
        status, 
        due_date
      )
      VALUES ($1, $2, $3, $4, 'draft', $5)
      RETURNING id
    `;

    const invoiceValues = [
      leadId || null,
      dealId || null,
      amount,
      description || `Invoice for ${customerName || customerEmail}`,
      dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    ];

    const invoiceResult = await pool.query(invoiceQuery, invoiceValues);
    const invoiceId = invoiceResult.rows[0].id;

    // Add note to HubSpot deal if dealId provided
    if (dealId) {
      await hubspot.addNote(
        'deal', 
        dealId, 
        `Invoice created: $${amount} - ${description || 'No description'}`
      );
    }

    res.status(201).json({ 
      success: true, 
      invoiceId,
      message: 'Invoice created successfully. Stripe integration coming next!' 
    });

  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
}