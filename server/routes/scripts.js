import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { dbAll, dbRun, dbGet } from '../db.js' // Updated imports
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Get all scripts
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Updated to await dbAll
    const scripts = await dbAll('SELECT id, title, content, createdAt FROM scripts WHERE userId = ? ORDER BY createdAt DESC', [req.user.id])
    res.json(scripts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scripts' })
  }
})

// Add new script
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' })
    }

    const id = uuidv4()

    // Updated to await dbRun
    await dbRun(
      'INSERT INTO scripts (id, userId, title, content) VALUES (?, ?, ?, ?)',
      [id, req.user.id, title, content]
    )

    // Updated to await dbGet
    const script = await dbGet('SELECT * FROM scripts WHERE id = ?', [id])

    res.status(201).json(script)
  } catch (err) {
    console.error('Add script error:', err)
    res.status(500).json({ error: 'Failed to add script' })
  }
})

// Delete script
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Updated to await dbRun
    const result = await dbRun('DELETE FROM scripts WHERE id = ? AND userId = ?', [req.params.id, req.user.id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Script not found' })
    }

    res.json({ message: 'Script deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete script' })
  }
})

export default router
