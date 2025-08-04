import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database schema
const initSchema = async () => {
  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'client',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Leads table
    `CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      ghl_contact_id VARCHAR(255) UNIQUE,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      name VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      industry VARCHAR(100),
      source VARCHAR(100),
      status VARCHAR(50) DEFAULT 'new',
      score INTEGER DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Projects table
    `CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES users(id),
      lead_id INTEGER REFERENCES leads(id),
      name VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      package_type VARCHAR(100) DEFAULT 'basic',
      setup_fee DECIMAL(10,2) DEFAULT 497.00,
      monthly_fee DECIMAL(10,2) DEFAULT 49.00,
      domain VARCHAR(255),
      repo_url VARCHAR(500),
      live_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Subscriptions table
    `CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES users(id),
      project_id INTEGER REFERENCES projects(id),
      stripe_subscription_id VARCHAR(255) UNIQUE,
      plan_type VARCHAR(100) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      current_period_start TIMESTAMP,
      current_period_end TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // GHL accounts table
    `CREATE TABLE IF NOT EXISTS ghl_accounts (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES users(id),
      ghl_sub_account_id VARCHAR(255) UNIQUE,
      account_name VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      monthly_fee DECIMAL(10,2) DEFAULT 97.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }
  
  console.log('Database schema initialized');
};

export { pool, initSchema };