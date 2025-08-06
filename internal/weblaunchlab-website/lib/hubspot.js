import axios from 'axios';

class HubSpotClient {
  constructor() {
    this.apiToken = process.env.HUBSPOT_API_TOKEN;
    this.baseURL = 'https://api.hubspot.com';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Contact Management
  async createContact(contactData) {
    try {
      const response = await this.client.post('/crm/v3/objects/contacts', {
        properties: {
          email: contactData.email,
          firstname: contactData.firstName || contactData.name?.split(' ')[0] || '',
          lastname: contactData.lastName || contactData.name?.split(' ')[1] || '',
          phone: contactData.phone || '',
          company: contactData.company || '',
          website: contactData.website || '',
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
          hs_analytics_source: contactData.source === 'Manual Entry' ? 'OFFLINE' : 'DIRECT_TRAFFIC'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating HubSpot contact:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateContact(contactId, updateData) {
    try {
      const response = await this.client.patch(`/crm/v3/objects/contacts/${contactId}`, {
        properties: updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating HubSpot contact:', error.response?.data || error.message);
      throw error;
    }
  }

  async getContacts(limit = 100, after = null) {
    try {
      const params = { limit };
      if (after) params.after = after;
      
      const response = await this.client.get('/crm/v3/objects/contacts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching HubSpot contacts:', error.response?.data || error.message);
      throw error;
    }
  }

  async findContactByEmail(email) {
    try {
      const response = await this.client.post('/crm/v3/objects/contacts/search', {
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email
          }]
        }]
      });
      return response.data.results[0] || null;
    } catch (error) {
      console.error('Error finding contact by email:', error.response?.data || error.message);
      return null;
    }
  }

  async deleteContact(contactId) {
    try {
      const response = await this.client.delete(`/crm/v3/objects/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting HubSpot contact:', error.response?.data || error.message);
      throw error;
    }
  }

  // Deal Management
  async createDeal(dealData) {
    try {
      const response = await this.client.post('/crm/v3/objects/deals', {
        properties: {
          dealname: dealData.name || `${dealData.company || 'Lead'} - Website Project`,
          amount: dealData.amount || '',
          dealstage: dealData.stage || 'appointmentscheduled', // Default to first stage
          pipeline: dealData.pipeline || 'default',
          hubspot_owner_id: dealData.ownerId || '',
          closedate: dealData.closeDate || '',
          deal_type: dealData.type || 'newbusiness',
          hs_analytics_source: dealData.source === 'Manual Entry' ? 'OFFLINE' : 'DIRECT_TRAFFIC'
        },
        associations: dealData.contactId ? [{
          to: { id: dealData.contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }] // Contact to Deal
        }] : []
      });
      return response.data;
    } catch (error) {
      console.error('Error creating HubSpot deal:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateDeal(dealId, updateData) {
    try {
      const response = await this.client.patch(`/crm/v3/objects/deals/${dealId}`, {
        properties: updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating HubSpot deal:', error.response?.data || error.message);
      throw error;
    }
  }

  async getDeals(limit = 100, after = null) {
    try {
      const params = { 
        limit,
        properties: 'dealname,amount,dealstage,pipeline,closedate,createdate,hs_lastmodifieddate,hubspot_owner_id,deal_type,lead_source'
      };
      if (after) params.after = after;
      
      const response = await this.client.get('/crm/v3/objects/deals', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching HubSpot deals:', error.response?.data || error.message);
      throw error;
    }
  }

  // Pipeline Management
  async getPipelines() {
    try {
      const response = await this.client.get('/crm/v3/pipelines/deals');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipelines:', error.response?.data || error.message);
      throw error;
    }
  }

  // Lead to Deal Conversion
  async createLeadWithDeal(leadData) {
    try {
      console.log('Creating lead with data:', leadData);
      
      // First, check if contact exists
      let contact = await this.findContactByEmail(leadData.email);
      
      // Create contact if it doesn't exist
      if (!contact) {
        console.log('Contact not found, creating new contact');
        contact = await this.createContact(leadData);
        console.log('Contact created:', contact.id);
      } else {
        console.log('Contact already exists:', contact.id);
      }

      // Create deal associated with contact
      console.log('Creating deal for contact:', contact.id);
      const deal = await this.createDeal({
        ...leadData,
        contactId: contact.id
      });
      console.log('Deal created:', deal.id);

      return { contact, deal };
    } catch (error) {
      console.error('Error creating lead with deal:', error.response?.data || error.message);
      throw error;
    }
  }

  // Notes/Activities
  async addNote(objectType, objectId, noteText) {
    try {
      const response = await this.client.post('/crm/v3/objects/notes', {
        properties: {
          hs_note_body: noteText,
          hs_timestamp: new Date().toISOString()
        },
        associations: [{
          to: { id: objectId },
          types: [{ 
            associationCategory: 'HUBSPOT_DEFINED', 
            associationTypeId: objectType === 'contact' ? 202 : 214 
          }]
        }]
      });
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new HubSpotClient();