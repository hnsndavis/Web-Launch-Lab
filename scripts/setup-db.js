const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Create database if it doesn't exist
async function setupDatabase() {
  // First connect to postgres to create the database
  const setupPool = new Pool({
    user: process.env.USER || 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    port: 5432,
  });

  try {
    await setupPool.query('CREATE DATABASE weblaunchlab_dev');
    console.log('Database created successfully');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', error.message);
    }
  }
  await setupPool.end();

  // Now connect to our database and create tables
  const pool = new Pool({
    user: process.env.USER || 'postgres',
    host: 'localhost',
    database: 'weblaunchlab_dev',
    password: process.env.POSTGRES_PASSWORD || '',
    port: 5432,
  });

  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'client',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
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
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error.message);
    }
  }

  // Create demo accounts
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('client123', 10);

    await pool.query(`
      INSERT INTO users (email, password_hash, role) 
      VALUES 
        ('admin@weblaunchlab.com', $1, 'admin'),
        ('client@example.com', $2, 'client')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword, clientPassword]);

    console.log('Demo accounts created');
  } catch (error) {
    console.error('Error creating demo accounts:', error.message);
  }

  // Create sample leads
  try {
    await pool.query(`
      INSERT INTO leads (email, name, company, industry, source, score, status)
      VALUES 
        ('john@smithdental.com', 'John Smith', 'Smith Dental', 'Healthcare', 'website', 85, 'new'),
        ('mary@tacotime.com', 'Mary Rodriguez', 'Taco Time', 'Restaurant', 'referral', 92, 'contacted'),
        ('bob@bobsplumbing.com', 'Bob Wilson', 'Bobs Plumbing', 'Home Services', 'google', 78, 'qualified')
      ON CONFLICT DO NOTHING
    `);

    console.log('Sample leads created');
  } catch (error) {
    console.error('Error creating sample leads:', error.message);
  }

  await pool.end();
  console.log('Database setup complete!');
}

setupDatabase();