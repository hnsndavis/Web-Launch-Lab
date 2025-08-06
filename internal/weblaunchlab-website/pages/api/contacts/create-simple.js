import hubspot from '../../../lib/hubspot.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Simple contact creation request:', req.body);
    
    const { email, firstName, lastName, company, phone } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({ error: 'Email and first name are required' });
    }

    // Try to create just a contact first
    const contact = await hubspot.createContact({
      email,
      firstName,
      lastName: lastName || '',
      company: company || '',
      phone: phone || '',
      source: 'Manual Entry'
    });

    console.log('Contact created successfully:', contact);

    res.status(201).json({ 
      success: true, 
      contactId: contact.id,
      message: 'Contact created successfully in HubSpot!'
    });

  } catch (error) {
    console.error('Contact creation error:', error);
    console.error('Error details:', error.response?.data);
    
    res.status(500).json({ 
      error: 'Failed to create contact',
      details: error.message,
      hubspotError: error.response?.data
    });
  }
}