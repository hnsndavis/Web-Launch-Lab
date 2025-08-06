import { supabase } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Failed to fetch contacts' })
      }

      res.status(200).json(contacts || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const { name, email, phone, company, industry, source, notes } = req.body

      const { data: contact, error } = await supabase
        .from('contacts')
        .insert({
          name,
          email,
          phone,
          company,
          industry,
          source: source || 'manual',
          status: 'new',
          score: 50,
          notes
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Failed to create contact' })
      }

      // Log activity
      await supabase
        .from('activities')
        .insert({
          contact_id: contact.id,
          activity_type: 'contact_created',
          description: `Contact created: ${name}`
        })

      res.status(201).json(contact)
    } catch (error) {
      console.error('Error creating contact:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}