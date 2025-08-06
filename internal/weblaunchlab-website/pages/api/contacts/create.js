import hubspot from '../../../lib/hubspot.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Contact creation request body:', req.body);
    
    const { 
      email, 
      name,
      firstName,
      lastName,
      company, 
      phone,
      website,
      source = 'Manual Entry',
      amount,
      notes
    } = req.body;

    console.log('Parsed data:', { email, firstName, lastName, company, phone });

    if (!email || !firstName) {
      console.log('Validation failed: missing email or firstName');
      return res.status(400).json({ error: 'Email and first name are required' });
    }

    // Create contact first
    const contact = await hubspot.createContact({
      email,
      name: name || `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      company: company || '',
      phone: phone || '',
      website: website || '',
      source
    });

    let deal = null;
    
    // Try to create deal, but don't fail if it doesn't work
    if (amount && parseFloat(amount) > 0) {
      try {
        deal = await hubspot.createDeal({
          name: `${company || firstName + ' ' + lastName} - Website Project`,
          contactId: contact.id,
          amount: amount.toString(),
          stage: 'appointmentscheduled',
          source
        });
        console.log('Deal created successfully:', deal.id);
      } catch (dealError) {
        console.error('Deal creation failed, but contact was created:', dealError.response?.data || dealError.message);
        // Continue without deal - contact was created successfully
      }
    }

    const hubspotResult = { contact, deal };

    // Add notes if provided
    if (notes) {
      await hubspot.addNote('contact', hubspotResult.contact.id, notes);
      if (hubspotResult.deal && hubspotResult.deal.id) {
        await hubspot.addNote('deal', hubspotResult.deal.id, `Initial notes: ${notes}`);
      }
    }

    res.status(201).json({ 
      success: true, 
      contactId: hubspotResult.contact.id,
      dealId: hubspotResult.deal?.id,
      message: 'Contact and deal created successfully in HubSpot!'
    });

  } catch (error) {
    console.error('Contact creation error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create contact';
    if (error.response?.status === 400) {
      errorMessage = 'Invalid data provided. Please check all fields.';
    } else if (error.response?.status === 409) {
      errorMessage = 'Contact with this email already exists.';
    } else if (error.message?.includes('Request failed')) {
      errorMessage = 'HubSpot API error. Please try again.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
}