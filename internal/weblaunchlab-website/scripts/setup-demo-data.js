// Run this after setting up your Supabase database to add demo data
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Load environment variables
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const demoContacts = [
  {
    name: 'Sarah Chen',
    email: 'sarah@chensdental.com',
    phone: '(555) 123-4567',
    company: 'Chens Dental Practice',
    industry: 'Healthcare',
    score: 85,
    status: 'qualified',
    source: 'website',
    notes: 'Interested in modern website design. Has 3 locations.'
  },
  {
    name: 'Mike Rodriguez',
    email: 'mike@tacolibre.com',
    phone: '(555) 234-5678',
    company: 'Taco Libre Restaurant',
    industry: 'Restaurant',
    score: 92,
    status: 'won',
    source: 'referral',
    notes: 'Ready to move forward. Needs online ordering.'
  },
  {
    name: 'Lisa Johnson',
    email: 'lisa@johnsonplumbing.com',
    phone: '(555) 345-6789',
    company: 'Johnson Plumbing',
    industry: 'Home Services',
    score: 78,
    status: 'contacted',
    source: 'google',
    notes: 'Interested but wants to see examples first.'
  }
]

async function createDemoUser() {
  const password = 'password'
  const hashedPassword = await bcrypt.hash(password, 10)
  
  return {
    email: 'admin@weblaunchlab.com',
    password_hash: hashedPassword,
    role: 'admin'
  }
}

async function setupDemoData() {
  console.log('🚀 Setting up demo data...')

  try {
    // Add demo admin user
    const demoUser = await createDemoUser()
    const { error: userError } = await supabase
      .from('users')
      .insert(demoUser)

    if (userError && !userError.message.includes('duplicate')) {
      console.error('Error creating demo user:', userError)
      return
    }

    console.log('✅ Demo admin user created (admin@weblaunchlab.com / password)')

    // Add demo contacts
    const { error: contactsError } = await supabase
      .from('contacts')
      .insert(demoContacts)

    if (contactsError) {
      console.error('Error creating demo contacts:', contactsError)
      return
    }

    console.log('✅ Demo contacts created')
    console.log('✅ Setup complete! You can now login and test the system.')
  } catch (error) {
    console.error('Setup failed:', error)
  }
}

setupDemoData()