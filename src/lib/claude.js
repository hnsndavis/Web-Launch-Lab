const axios = require('axios');

class ClaudeClient {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseURL = 'https://api.anthropic.com/v1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });
  }

  async generatePersonalizedOutreach(leadData, templateType = 'initial') {
    const prompt = `Generate a personalized outreach email for:
    
    Lead Details:
    - Name: ${leadData.name}
    - Company: ${leadData.company}
    - Industry: ${leadData.industry}
    - Source: ${leadData.source}
    
    Email Type: ${templateType}
    
    Our Service: Professional websites for $497 setup + $49/month maintenance
    
    Requirements:
    - Professional but conversational tone
    - Industry-specific pain points
    - Clear value proposition
    - Soft call-to-action
    - Maximum 150 words
    
    Return only the email body, no subject line.`;

    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      return response.data.content[0].text.trim();
    } catch (error) {
      console.error('Error generating outreach:', error.response?.data || error.message);
      throw error;
    }
  }

  async generateWebsiteContent(projectData) {
    const prompt = `Generate website content for:
    
    Business: ${projectData.businessName}
    Industry: ${projectData.industry}
    Services: ${projectData.services.join(', ')}
    Target Audience: ${projectData.targetAudience}
    Unique Value Prop: ${projectData.uniqueValue}
    
    Generate:
    1. Compelling headline (max 10 words)
    2. Subheadline (max 20 words)  
    3. 3 key benefits (max 15 words each)
    4. Call-to-action text (max 5 words)
    5. About section (max 100 words)
    
    Return as JSON format.`;

    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      return JSON.parse(response.data.content[0].text);
    } catch (error) {
      console.error('Error generating website content:', error.response?.data || error.message);
      throw error;
    }
  }

  async generateProjectTimeline(projectData) {
    const prompt = `Create a project timeline for:
    
    Project Type: ${projectData.packageType}
    Industry: ${projectData.industry}
    Special Requirements: ${projectData.requirements || 'Standard website'}
    
    Generate realistic timeline with:
    - Phase names
    - Duration in days
    - Key deliverables
    - Client actions needed
    
    Return as JSON array of phases.`;

    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-haiku-20240307',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      return JSON.parse(response.data.content[0].text);
    } catch (error) {
      console.error('Error generating timeline:', error.response?.data || error.message);
      throw error;
    }
  }

  async scoreLeadQuality(leadData) {
    const prompt = `Score this lead quality from 0-100:
    
    Lead Data:
    - Industry: ${leadData.industry}
    - Company Size: ${leadData.companySize || 'Unknown'}
    - Current Website: ${leadData.hasWebsite ? 'Yes' : 'No'}
    - Budget Indication: ${leadData.budgetRange || 'Unknown'}
    - Engagement Level: ${leadData.engagementLevel || 'Unknown'}
    - Source: ${leadData.source}
    
    Return only the numeric score (0-100).`;

    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-haiku-20240307',
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      return parseInt(response.data.content[0].text.trim());
    } catch (error) {
      console.error('Error scoring lead:', error.response?.data || error.message);
      return 50; // Default score on error
    }
  }
}

module.exports = new ClaudeClient();