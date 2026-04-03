import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync, existsSync } from 'fs'

import { initDB } from './db.js'
import authRoutes from './routes/auth.js'
import callRoutes from './routes/calls.js'
import scriptRoutes from './routes/scripts.js'
import teamRoutes from './routes/team.js' 
import userRoutes from './routes/users.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'uploads')
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true })
}

// Middleware
app.use(cors({
  origin: '*', // For the easiest split-deployment, allow all
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

    // Handle Preflight (OPTIONS) requests explicitly
    app.options('*all', cors())

    // Start server after database initialization
    async function startServer() {
      try {
        // Initialize database (async because of sql.js)
        await initDB()

        // Routes
        app.use('/api/auth', authRoutes)
        app.use('/api/calls', callRoutes)
        app.use('/api/scripts', scriptRoutes)
        app.use('/api/team', teamRoutes)
        app.use('/api/users', userRoutes)

        // Serve static frontend in production
        const clientDistPath = join(__dirname, '..', 'client', 'dist')
        if (existsSync(clientDistPath)) {
          app.use(express.static(clientDistPath))
          app.get('*all', (req, res) => {
            if (!req.path.startsWith('/api')) {
              res.sendFile(join(clientDistPath, 'index.html'))
            }
          })
      console.log('🌐 Serving production frontend from client/dist')
    }

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    app.listen(PORT, () => {
      console.log(`🚀 Salyzer server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
