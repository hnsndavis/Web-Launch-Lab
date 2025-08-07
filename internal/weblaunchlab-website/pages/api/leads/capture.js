export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, source } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // For now, just log the lead capture
    // In the future, you can add email service integration here
    console.log('Lead captured:', { email, source, timestamp: new Date().toISOString() });

    res.status(200).json({ 
      success: true,
      message: 'Lead captured successfully'
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
}