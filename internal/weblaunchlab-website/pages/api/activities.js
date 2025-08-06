import { supabase } from '../../lib/database'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: activities, error } = await supabase
        .from('activities')
        .select(`
          *,
          contacts (name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Failed to fetch activities' })
      }

      res.status(200).json(activities || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}