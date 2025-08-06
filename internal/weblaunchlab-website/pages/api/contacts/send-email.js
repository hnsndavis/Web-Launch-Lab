import { supabase } from '../../../lib/database'
import { EmailService } from '../../../lib/ses'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { contactId, subject, message } = req.body

    if (!contactId || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get contact details
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single()

    if (contactError || !contact) {
      return res.status(404).json({ error: 'Contact not found' })
    }

    // Send email
    const emailResult = await EmailService.sendEmail({
      to: contact.email,
      subject: subject,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Hello ${contact.name},</h2>
          <div style="line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <br>
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            WebLaunch Lab Team
          </p>
        </div>
      `,
      textBody: `Hello ${contact.name},\n\n${message}\n\nBest regards,\nWebLaunch Lab Team`
    })

    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send email', details: emailResult.error })
    }

    // Log activity
    await supabase
      .from('activities')
      .insert({
        contact_id: contactId,
        activity_type: 'email_sent',
        description: `Email sent: ${subject}`,
        metadata: {
          subject,
          message_id: emailResult.messageId
        }
      })

    res.status(200).json({ success: true, messageId: emailResult.messageId })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}