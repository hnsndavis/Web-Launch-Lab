import { supabase } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get total contacts
    const { count: totalLeads, error: totalError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })

    // Get new contacts (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: newLeads, error: newError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Get qualified contacts
    const { count: qualifiedLeads, error: qualifiedError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'qualified')

    // Get won contacts
    const { count: wonLeads, error: wonError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'won')

    if (totalError || newError || qualifiedError || wonError) {
      console.error('Supabase error:', { totalError, newError, qualifiedError, wonError })
      return res.status(500).json({ error: 'Failed to fetch stats' })
    }

    const stats = {
      totalLeads: totalLeads || 0,
      newLeads: newLeads || 0,
      qualifiedLeads: qualifiedLeads || 0,
      wonLeads: wonLeads || 0,
      monthlyRevenue: (wonLeads || 0) * 497 // $497 setup fee per won deal
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}