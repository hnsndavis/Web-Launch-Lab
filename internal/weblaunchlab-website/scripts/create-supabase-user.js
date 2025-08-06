// Create a user in Supabase Auth
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createAuthUser() {
  console.log('🔐 Creating Supabase Auth user...')

  try {
    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@weblaunchlab.com',
      password: 'password',
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Auth user creation failed:', authError.message)
      return
    }

    console.log('✅ Supabase Auth user created successfully!')
    console.log('📧 Email: admin@weblaunchlab.com')
    console.log('🔑 Password: password')
    console.log('👤 Role: admin')
    
  } catch (error) {
    console.error('❌ Script failed:', error.message)
    console.log('\n🔧 Alternative approach:')
    console.log('   1. Go to your Supabase dashboard')
    console.log('   2. Go to Authentication > Users')
    console.log('   3. Click "Add user"')
    console.log('   4. Email: admin@weblaunchlab.com')
    console.log('   5. Password: password')
    console.log('   6. Confirm email: checked')
  }
}

createAuthUser()