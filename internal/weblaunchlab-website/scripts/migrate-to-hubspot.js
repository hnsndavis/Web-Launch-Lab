const { Pool } = require('pg');

async function migrateToHubSpot() {
  const pool = new Pool({
    user: process.env.USER || 'postgres',
    host: 'localhost',
    database: 'weblaunchlab_dev',
    password: process.env.POSTGRES_PASSWORD || '',
    port: 5432,
  });

  const migrations = [
    // Add HubSpot columns to leads table
    `ALTER TABLE leads 
     ADD COLUMN IF NOT EXISTS hubspot_contact_id VARCHAR(255),
     ADD COLUMN IF NOT EXISTS hubspot_deal_id VARCHAR(255)`,
    
    // Create unique constraint on hubspot_contact_id
    `ALTER TABLE leads 
     DROP CONSTRAINT IF EXISTS leads_hubspot_contact_id_unique`,
    
    `ALTER TABLE leads 
     ADD CONSTRAINT leads_hubspot_contact_id_unique 
     UNIQUE (hubspot_contact_id)`,
    
    // Create invoices table for Stripe integration
    `CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      lead_id INTEGER REFERENCES leads(id),
      hubspot_deal_id VARCHAR(255),
      stripe_invoice_id VARCHAR(255) UNIQUE,
      amount DECIMAL(10,2) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'draft',
      due_date TIMESTAMP,
      paid_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Create index for faster lookups
    `CREATE INDEX IF NOT EXISTS idx_leads_hubspot_contact_id 
     ON leads(hubspot_contact_id)`,
    
    `CREATE INDEX IF NOT EXISTS idx_leads_hubspot_deal_id 
     ON leads(hubspot_deal_id)`,
    
    `CREATE INDEX IF NOT EXISTS idx_invoices_hubspot_deal_id 
     ON invoices(hubspot_deal_id)`
  ];

  for (const migration of migrations) {
    try {
      await pool.query(migration);
      console.log('Migration executed successfully');
    } catch (error) {
      console.error('Migration error:', error.message);
    }
  }

  await pool.end();
  console.log('HubSpot migration complete!');
}

migrateToHubSpot();