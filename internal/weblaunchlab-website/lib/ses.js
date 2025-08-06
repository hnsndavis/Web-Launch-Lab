import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
})

export class EmailService {
  static async sendEmail({ to, subject, htmlBody, textBody, from }) {
    const params = {
      Source: from || process.env.FROM_EMAIL || 'noreply@weblaunchlab.com',
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: htmlBody, Charset: 'UTF-8' },
          Text: { Data: textBody || htmlBody.replace(/<[^>]*>/g, ''), Charset: 'UTF-8' }
        }
      }
    }

    try {
      const result = await sesClient.send(new SendEmailCommand(params))
      return { success: true, messageId: result.MessageId }
    } catch (error) {
      console.error('SES Error:', error)
      return { success: false, error: error.message }
    }
  }
}