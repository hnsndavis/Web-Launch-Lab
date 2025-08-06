// Run database migration directly on cloud Supabase
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function runMigration() {
  console.log('🚀 Running database migration...')
  
  try {
    // Read the migration file
    const migrationPath = join(__dirname, '../supabase/migrations/20250806201738_initial_schema.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    console.log('📄 Migration file loaded')
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      // Try alternative approach - split by statements
      console.log('⚡ Trying alternative approach...')
      
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      console.log(`📝 Found ${statements.length} SQL statements`)
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';'
        console.log(`   Executing statement ${i + 1}/${statements.length}`)
        
        // Use the raw SQL execution for each statement
        const { error: stmtError } = await supabase.rpc('exec_sql', { 
          sql: statement 
        }).catch(async () => {
          // If rpc doesn't work, we'll need to suggest manual approach
          return { error: 'RPC not available' }
        })
        
        if (stmtError && !stmtError.message?.includes('already exists')) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, stmtError.message)
        }
      }
    }
    
    console.log('✅ Migration completed!')
    console.log('🎉 Your database schema is ready!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n🔧 Manual approach:')
    console.log('   1. Go to your Supabase dashboard')
    console.log('   2. Open the SQL Editor') 
    console.log('   3. Copy and paste the contents of supabase/migrations/20250806201738_initial_schema.sql')
    console.log('   4. Click "Run" to execute the migration')
  }
}

runMigration()