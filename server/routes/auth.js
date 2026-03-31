import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { dbGet, dbRun } from '../db.js' // Updated import
import { generateToken } from '../middleware/auth.js'

const router = Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    // Check if user exists - updated to dbGet
    const existing = dbGet('SELECT id FROM users WHERE email = ?', [email])
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const id = uuidv4()
    const userRole = role === 'manager' ? 'manager' : 'agent'

    // Updated to dbRun
    dbRun(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, userRole]
    )

    const user = { id, name, email, role: userRole }
    const token = generateToken(user)

    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Updated to dbGet
    const user = dbGet('SELECT * FROM users WHERE email = ?', [email])

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const userData = { id: user.id, name: user.name, email: user.email, role: user.role }
    const token = generateToken(userData)

    res.json({ token, user: userData })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
