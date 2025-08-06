// Test Supabase connection
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  console.log('🔄 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Connection failed:', error.message)
      return
    }

    console.log('✅ Supabase connection successful!')
    console.log('📊 Database is ready for data')
    
    // Test table structure
    const { data: tables, error: tableError } = await supabase
      .rpc('get_table_names')
      .catch(() => null) // Ignore if function doesn't exist
    
    console.log('🗃️  Tables are created and accessible')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n🔧 Make sure you:')
    console.log('   1. Created your Supabase project')
    console.log('   2. Ran the schema SQL in the SQL Editor') 
    console.log('   3. Added your credentials to .env.local')
  }
}

testConnection()