const jwt = require('jsonwebtoken');

// Demo users - in production this would be in a database
const demoUsers = [
  {
    id: 1,
    email: 'admin@weblaunchlab.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    email: 'client@example.com',
    password: 'client123',
    role: 'client'
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user in demo data
    const user = demoUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'demo-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}