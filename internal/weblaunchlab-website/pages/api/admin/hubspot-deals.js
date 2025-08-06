import hubspot from '../../../lib/hubspot.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch deals from HubSpot
      const dealsResponse = await hubspot.getDeals(50);
      const deals = dealsResponse.results || [];

      // Transform HubSpot deal data for our dashboard
      const transformedDeals = deals.map(deal => ({
        id: deal.id,
        name: deal.properties.dealname || 'Unnamed Deal',
        amount: deal.properties.amount ? parseFloat(deal.properties.amount) : 0,
        stage: deal.properties.dealstage || 'unknown',
        pipeline: deal.properties.pipeline || 'default',
        closeDate: deal.properties.closedate,
        createdAt: deal.properties.createdate,
        lastModified: deal.properties.hs_lastmodifieddate,
        source: deal.properties.lead_source || 'unknown',
        type: deal.properties.deal_type || 'newbusiness'
      }));

      res.status(200).json(transformedDeals);
    } catch (error) {
      console.error('Error fetching HubSpot deals:', error);
      res.status(500).json({ error: 'Failed to fetch deals' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { dealId, stage, amount, notes } = req.body;
      
      if (!dealId) {
        return res.status(400).json({ error: 'Deal ID is required' });
      }

      const updateData = {};
      if (stage) updateData.dealstage = stage;
      if (amount !== undefined) updateData.amount = amount.toString();

      // Update deal in HubSpot
      const updatedDeal = await hubspot.updateDeal(dealId, updateData);

      // Add note if provided
      if (notes) {
        await hubspot.addNote('deal', dealId, notes);
      }

      res.status(200).json({ success: true, deal: updatedDeal });
    } catch (error) {
      console.error('Error updating deal:', error);
      res.status(500).json({ error: 'Failed to update deal' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}