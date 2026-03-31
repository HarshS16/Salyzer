import { Router } from 'express'
import { dbAll } from '../db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Get all agents and their stats (Manager only)
router.get('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Access denied. Manager role required.' })
  }

  try {
    // Get all users who are agents, along with their call stats
    const agents = await dbAll(`
      SELECT 
        u.id, 
        u.name, 
        u.email,
        COUNT(c.id) as callCount,
        COALESCE(ROUND(AVG(c.overallScore)), 0) as avgScore,
        MAX(c.createdAt) as lastCall
      FROM users u
      LEFT JOIN calls c ON u.id = c.userId
      WHERE u.role = 'agent'
      GROUP BY u.id, u.name, u.email
    `)

    res.json(agents)
  } catch (err) {
    console.error('Fetch team error:', err)
    res.status(500).json({ error: 'Failed to fetch team data' })
  }
})

export default router
