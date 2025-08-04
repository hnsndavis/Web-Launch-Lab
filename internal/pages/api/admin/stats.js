// Demo stats - will calculate from real data later
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // In a real app, you'd check authentication here
  // const user = await authenticateUser(req);
  // if (!user || user.role !== 'admin') {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    // These would be calculated from your actual database
    const stats = {
      totalLeads: 8,
      newLeads: 1,
      qualifiedLeads: 3,
      wonLeads: 1,
      monthlyRevenue: 2485 // $497 setup * 5 won deals this month
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}