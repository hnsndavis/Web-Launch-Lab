import axios from 'axios';

class GHLClient {
  constructor() {
    this.apiKey = process.env.GHL_API_KEY;
    this.agencyId = process.env.GHL_AGENCY_ID;
    this.baseURL = 'https://rest.gohighlevel.com/v1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Lead Management
  async createContact(contactData) {
    try {
      const response = await this.client.post('/contacts', {
        ...contactData,
        locationId: this.agencyId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating GHL contact:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateContact(contactId, updateData) {
    try {
      const response = await this.client.put(`/contacts/${contactId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating GHL contact:', error.response?.data || error.message);
      throw error;
    }
  }

  async getContacts(filters = {}) {
    try {
      const response = await this.client.get('/contacts', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching GHL contacts:', error.response?.data || error.message);
      throw error;
    }
  }

  // Workflow Management
  async triggerWorkflow(contactId, workflowId) {
    try {
      const response = await this.client.post('/workflows/trigger', {
        contactId,
        workflowId
      });
      return response.data;
    } catch (error) {
      console.error('Error triggering workflow:', error.response?.data || error.message);
      throw error;
    }
  }

  // Sub-account Management (White Label)
  async createSubAccount(accountData) {
    try {
      const response = await this.client.post('/sub-accounts', {
        name: accountData.name,
        address: accountData.address || '',
        city: accountData.city || '',
        state: accountData.state || '',
        country: accountData.country || 'US',
        postalCode: accountData.postalCode || '',
        website: accountData.website || '',
        timezone: accountData.timezone || 'America/New_York'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating sub-account:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSubAccount(subAccountId) {
    try {
      const response = await this.client.get(`/sub-accounts/${subAccountId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sub-account:', error.response?.data || error.message);
      throw error;
    }
  }

  // Campaign Management
  async createCampaign(campaignData) {
    try {
      const response = await this.client.post('/campaigns', {
        ...campaignData,
        locationId: this.agencyId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error.response?.data || error.message);
      throw error;
    }
  }

  // Pipeline Management
  async updateOpportunity(opportunityId, stageId, monetaryValue = null) {
    try {
      const updateData = { pipelineStageId: stageId };
      if (monetaryValue) updateData.monetaryValue = monetaryValue;
      
      const response = await this.client.put(`/opportunities/${opportunityId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating opportunity:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new GHLClient();