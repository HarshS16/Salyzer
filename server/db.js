import initSqlJs from 'sql.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DB_PATH = join(__dirname, 'salyzer.db')

let db = null
let saveTimer = null

/**
 * Save database to disk (debounced)
 */
function saveToDisk() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    if (db) {
      const data = db.export()
      const buffer = Buffer.from(data)
      writeFileSync(DB_PATH, buffer)
    }
  }, 100)
}

/**
 * Get the database instance
 */
export function getDB() {
  if (!db) throw new Error('Database not initialized. Call initDB() first.')
  return db
}

/**
 * Helper: run a query that modifies data (INSERT, UPDATE, DELETE)
 */
export function dbRun(sql, params = []) {
  const database = getDB()
  database.run(sql, params)
  saveToDisk()
  return { changes: database.getRowsModified() }
}

/**
 * Helper: get a single row
 */
export function dbGet(sql, params = []) {
  const database = getDB()
  const stmt = database.prepare(sql)
  stmt.bind(params)
  if (stmt.step()) {
    const row = stmt.getAsObject()
    stmt.free()
    return row
  }
  stmt.free()
  return null
}

/**
 * Helper: get all rows
 */
export function dbAll(sql, params = []) {
  const database = getDB()
  const stmt = database.prepare(sql)
  stmt.bind(params)
  const results = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

/**
 * Initialize the database
 */
export async function initDB() {
  const SQL = await initSqlJs()

  // Load existing database or create new one
  if (existsSync(DB_PATH)) {
    const fileBuffer = readFileSync(DB_PATH)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'agent',
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS calls (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      filename TEXT NOT NULL,
      transcript TEXT,
      analysisResult TEXT,
      overallScore INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS scripts (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  saveToDisk()
  console.log('✅ Database initialized')
}
