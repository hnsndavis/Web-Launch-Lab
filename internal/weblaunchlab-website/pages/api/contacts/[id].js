import { supabase } from '../../../lib/database'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const { data: contact, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return res.status(404).json({ error: 'Contact not found' })
      }

      res.status(200).json(contact)
    } catch (error) {
      console.error('Error fetching contact:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  else if (req.method === 'PUT') {
    try {
      const updates = req.body

      const { data: contact, error } = await supabase
        .from('contacts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Failed to update contact' })
      }

      // Log activity
      await supabase
        .from('activities')
        .insert({
          contact_id: id,
          activity_type: 'contact_updated',
          description: `Contact updated: ${contact.name}`
        })

      res.status(200).json(contact)
    } catch (error) {
      console.error('Error updating contact:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: 'Failed to delete contact' })
      }

      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting contact:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}