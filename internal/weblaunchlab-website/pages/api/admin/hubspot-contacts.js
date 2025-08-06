import hubspot from '../../../lib/hubspot.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch contacts from HubSpot
      const contactsResponse = await hubspot.getContacts(100);
      const contacts = contactsResponse.results || [];

      // Transform HubSpot contact data for our table
      const transformedContacts = contacts.map(contact => ({
        id: contact.id,
        firstName: contact.properties.firstname || '',
        lastName: contact.properties.lastname || '',
        email: contact.properties.email || '',
        phone: contact.properties.phone || '',
        company: contact.properties.company || '',
        website: contact.properties.website || '',
        leadStatus: contact.properties.hs_lead_status || 'NEW',
        lifecycleStage: contact.properties.lifecyclestage || 'lead',
        createDate: contact.properties.createdate,
        lastModified: contact.properties.lastmodifieddate,
        source: contact.properties.lead_source || contact.properties.hs_analytics_source || 'unknown'
      }));

      res.status(200).json(transformedContacts);
    } catch (error) {
      console.error('Error fetching HubSpot contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { contactId, ...updateData } = req.body;
      
      if (!contactId) {
        return res.status(400).json({ error: 'Contact ID is required' });
      }

      // Update contact in HubSpot
      const updatedContact = await hubspot.updateContact(contactId, {
        firstname: updateData.firstName,
        lastname: updateData.lastName,
        email: updateData.email,
        phone: updateData.phone || '',
        company: updateData.company || '',
        website: updateData.website || ''
      });

      res.status(200).json({ success: true, contact: updatedContact });
    } catch (error) {
      console.error('Error updating HubSpot contact:', error);
      res.status(500).json({ error: 'Failed to update contact' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { contactId } = req.query;
      
      if (!contactId) {
        return res.status(400).json({ error: 'Contact ID is required' });
      }

      // Delete contact from HubSpot (actually archives it)
      await hubspot.deleteContact(contactId);

      res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting HubSpot contact:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}