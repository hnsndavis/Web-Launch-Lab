import jwt from 'jsonwebtoken';

// Demo users - same as login
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key');
    
    const user = demoUsers.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}