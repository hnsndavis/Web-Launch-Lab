import hubspot from '../../../lib/hubspot.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone, name, company, source } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Create lead with deal in HubSpot only (no database)
    const hubspotResult = await hubspot.createLeadWithDeal({
      email,
      phone: phone || '',
      name: name || '',
      company: company || '',
      source: source || 'website',
      amount: '', // Will be filled in later during qualification
      stage: 'appointmentscheduled' // First stage in default pipeline
    });

    console.log('Lead created in HubSpot:', hubspotResult);

    res.status(200).json({ 
      success: true, 
      contactId: hubspotResult.contact.id,
      dealId: hubspotResult.deal.id,
      message: 'Lead created in HubSpot successfully!'
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: error.message || 'Failed to capture lead' });
  }
}