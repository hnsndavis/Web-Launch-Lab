// Demo data for now - will connect to real database/GHL later
const demoLeads = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah@chensdental.com',
    phone: '(555) 123-4567',
    company: 'Chens Dental Practice',
    industry: 'Healthcare',
    score: 85,
    status: 'qualified',
    source: 'website',
    notes: 'Interested in modern website design. Has 3 locations.',
    created_at: '2025-01-20T10:30:00Z',
    updated_at: '2025-01-20T14:20:00Z'
  },
  {
    id: 2,
    name: 'Mike Rodriguez',
    email: 'mike@tacolibre.com',
    phone: '(555) 234-5678',
    company: 'Taco Libre Restaurant',
    industry: 'Restaurant',
    score: 92,
    status: 'won',
    source: 'referral',
    notes: 'Ready to move forward. Needs online ordering.',
    created_at: '2025-01-19T09:15:00Z',
    updated_at: '2025-01-20T11:45:00Z'
  },
  {
    id: 3,
    name: 'Lisa Johnson',
    email: 'lisa@johnsonplumbing.com',
    phone: '(555) 345-6789',
    company: 'Johnson Plumbing',
    industry: 'Home Services',
    score: 78,
    status: 'contacted',
    source: 'google',
    notes: 'Interested but wants to see examples first.',
    created_at: '2025-01-18T16:20:00Z',
    updated_at: '2025-01-19T08:30:00Z'
  },
  {
    id: 4,
    name: 'David Park',
    email: 'david@parklaw.com',
    phone: '(555) 456-7890',
    company: 'Park Law Offices',
    industry: 'Legal',
    score: 95,
    status: 'qualified',
    source: 'linkedin',
    notes: 'High-value client. Needs professional rebrand.',
    created_at: '2025-01-17T13:45:00Z',
    updated_at: '2025-01-18T10:15:00Z'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    email: 'emma@fitnessfirst.com',
    phone: '(555) 567-8901',
    company: 'Fitness First Gym',
    industry: 'Fitness',
    score: 67,
    status: 'new',
    source: 'website',
    notes: 'New inquiry. Wants membership signup features.',
    created_at: '2025-01-16T11:30:00Z',
    updated_at: '2025-01-16T11:30:00Z'
  },
  {
    id: 6,
    name: 'Robert Kim',
    email: 'robert@kimaccounting.com',
    phone: '(555) 678-9012',
    company: 'Kim Accounting Services',
    industry: 'Professional Services',
    score: 73,
    status: 'contacted',
    source: 'website',
    notes: 'Needs client portal integration.',
    created_at: '2025-01-15T14:20:00Z',
    updated_at: '2025-01-16T09:45:00Z'
  },
  {
    id: 7,
    name: 'Maria Garcia',
    email: 'maria@garciarealty.com',
    phone: '(555) 789-0123',
    company: 'Garcia Real Estate',
    industry: 'Real Estate',
    score: 88,
    status: 'qualified',
    source: 'referral',
    notes: 'Wants property showcase website. Budget approved.',
    created_at: '2025-01-14T10:10:00Z',
    updated_at: '2025-01-15T16:30:00Z'
  },
  {
    id: 8,
    name: 'James Thompson',
    email: 'james@thompsonauto.com',
    phone: '(555) 890-1234',
    company: 'Thompson Auto Repair',
    industry: 'Automotive',
    score: 61,
    status: 'lost',
    source: 'google',
    notes: 'Decided to go with competitor. Price sensitive.',
    created_at: '2025-01-13T12:00:00Z',
    updated_at: '2025-01-14T15:20:00Z'
  }
];

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
    // Sort by most recent first
    const sortedLeads = demoLeads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.status(200).json(sortedLeads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}