import { Router } from 'express'
import { dbGet, dbRun } from '../db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Get current user profile with attributes
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, role, profile FROM users WHERE id = ?', [req.user.id])
    if (!user) return res.status(404).json({ error: 'User not found' })
    
    // Parse profile if it's a string (Postgres might return it as object or string depending on driver)
    let profile = user.profile || {}
    if (typeof profile === 'string') profile = JSON.parse(profile)
    
    res.json({ ...user, profile })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update user profile and attributes
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, profile } = req.body
    
    await dbRun(
      'UPDATE users SET name = ?, profile = ? WHERE id = ?',
      [name, JSON.stringify(profile || {}), req.user.id]
    )
    
    res.json({ message: 'Profile updated successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
