import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// For local dev, you can use local postgres, but DATABASE_URL is best for production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') || process.env.DATABASE_URL?.includes('neon.tech') 
    ? { rejectUnauthorized: false } 
    : false
})

/**
 * Compatibility Helper: Converts SQLite style queries (?) to Postgres style ($1)
 */
function convertQuery(sql) {
  let count = 0
  // Convert ? to $1, $2, etc.
  let pgSql = sql.replace(/\?/g, () => `$${++count}`)
  
  // Convert SQLite function calls if present
  pgSql = pgSql.replace(/datetime\('now'\)/gi, 'CURRENT_TIMESTAMP')
  pgSql = pgSql.replace(/datetime\('now', '-7 days'\)/gi, "CURRENT_TIMESTAMP - interval '7 days'")

  return pgSql
}

/**
 * Initialize Postgres Tables
 */
export async function initDB() {
  try {
    const client = await pool.connect()
    console.log('✅ Connected to Cloud Postgres.')

    // Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'agent',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create Calls Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS calls (
        id UUID PRIMARY KEY,
        userId UUID REFERENCES users(id),
        filename TEXT,
        transcript TEXT,
        analysisResult TEXT,
        overallScore INTEGER,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create Scripts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scripts (
        id UUID PRIMARY KEY,
        userId UUID REFERENCES users(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    client.release()
    console.log('🏛️ Postgres Schema verified and ready.')
  } catch (err) {
    console.error('❌ Database Initialization Error:', err.message)
    throw err
  }
}

/**
 * Executes a query and returns the first row
 */
export async function dbGet(sql, params = []) {
  const pgSql = convertQuery(sql)
  const res = await pool.query(pgSql, params)
  return res.rows[0]
}

/**
 * Executes a query and returns all rows
 */
export async function dbAll(sql, params = []) {
  const pgSql = convertQuery(sql)
  const res = await pool.query(pgSql, params)
  return res.rows
}

/**
 * Executes a query (INSERT, UPDATE, DELETE)
 */
export async function dbRun(sql, params = []) {
  const pgSql = convertQuery(sql)
  const res = await pool.query(pgSql, params)
  return { changes: res.rowCount }
}

export default pool
