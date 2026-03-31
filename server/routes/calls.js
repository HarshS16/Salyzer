import { Router } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { dirname, join, extname } from 'path'
import { unlinkSync, existsSync } from 'fs'
import { dbGet, dbRun, dbAll } from '../db.js' // Updated imports
import { authenticateToken } from '../middleware/auth.js'
import { 
  transcribeAudio, 
  analyzeTranscript, 
  generateDemoAnalysis, 
  formatTranscriptWithAI,
  diarizeAudio,
  mergeTranscriptAndDiarization
} from '../services/ai.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg', 'audio/mp4']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'))
    }
  },
})

// Upload & Analyze
router.post('/analyze', authenticateToken, upload.single('audio'), async (req, res) => {
  let filePath = null

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    filePath = req.file.path
    const filename = req.file.originalname
    const callId = uuidv4()

    let transcript
    let analysisResult

    const hasOpenRouterKey = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here'
    const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'
    const hasGroqKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here'

    // 1. Handle Transcription & Diarization
    const hasHFKey = process.env.HF_API_KEY && process.env.HF_API_KEY !== 'your_hf_api_key_here'

    if (hasGroqKey || hasOpenAIKey) {
      console.log('🎙️ Starting Pro Diarization Pipeline...')
      
      // Run Transcription and Diarization in Parallel
      const [whisperResult, diarizationResult] = await Promise.all([
        transcribeAudio(filePath),
        hasHFKey ? diarizeAudio(filePath) : null
      ])
      
      if (whisperResult) {
        if (diarizationResult) {
          // PRO PATH: Use Wave-based Diarization
          console.log('✅ Successfully diarized via Pyannote. Merging...')
          transcript = mergeTranscriptAndDiarization(whisperResult, diarizationResult)
        } else {
          // LITE PATH: Use AI-based formatting
          console.log('🔁 Diarization skipped/failed. Using AI formatting pass...')
          const rawText = whisperResult.text || (typeof whisperResult === 'string' ? whisperResult : '')
          transcript = await formatTranscriptWithAI(rawText)
        }
      }
    }

    // Fallback to demo transcript if transcription failed or keys missing
    if (!transcript) {
      console.log('⚠️ No active transcription service. Using demo transcript.')
      transcript = `Agent: Good morning! Thank you for calling. My name is Sarah from TechSolutions. How can I help you today?
Customer: Hi Sarah, I've been looking at your enterprise software package. We're a mid-size company with about 200 employees and we're struggling with our current project management setup.
Agent: I'd be happy to help with that! Our enterprise solution is designed exactly for companies your size. Can you tell me more about your current challenges?
Customer: Well, we're using multiple disconnected tools - one for task management, another for communication, and spreadsheets for tracking. It's becoming really inefficient.
Agent: I completely understand. Many of our clients faced similar challenges before switching to our platform. Our unified solution brings all of those functions together. Let me walk you through the key features.
Customer: That sounds good, but I'm a bit concerned about the pricing. We're working with a tight budget this quarter.
Agent: Our pricing is competitive in the market. The enterprise plan starts at $15 per user per month.
Customer: Hmm, that's a bit more than I expected. Some competitors are offering similar tools for less.
Agent: Right, well, we do offer various payment options. Would you like to see a demo?
Customer: Maybe, but I'm not sure if we're ready to commit yet. We'd need to see how it integrates with our existing systems.
Agent: We integrate with most major platforms. I can send you some documentation about that. Would you like me to schedule a demo for your team?
Customer: Let me think about it and get back to you. Can you send me some more information?
Agent: Absolutely! I'll send that right over. Thank you for your time today. Have a great day!
Customer: Thanks, bye.`
    }

    // 2. Handle Analysis
    if (hasOpenRouterKey) {
      console.log('🧠 Analyzing transcript with OpenRouter (Parallel Racing)...')
      const scripts = dbAll('SELECT title, content FROM scripts WHERE userId = ?', [req.user.id])
      analysisResult = await analyzeTranscript(transcript, scripts)
    } else {
      console.log('⚠️ No OpenRouter key. Using demo analysis metrics.')
      analysisResult = generateDemoAnalysis(transcript)
    }

    // Updated to dbRun
    dbRun(
      'INSERT INTO calls (id, userId, filename, transcript, analysisResult, overallScore) VALUES (?, ?, ?, ?, ?, ?)',
      [
        callId,
        req.user.id,
        filename,
        transcript,
        JSON.stringify(analysisResult),
        analysisResult.scores?.overall || 0
      ]
    )

    // Cleanup uploaded file
    if (filePath && existsSync(filePath)) {
      unlinkSync(filePath)
    }

    res.json({ callId, message: 'Analysis complete' })
  } catch (err) {
    console.error('Analysis error:', err)

    // Cleanup on error
    if (filePath && existsSync(filePath)) {
      try { unlinkSync(filePath) } catch {}
    }

    res.status(500).json({ error: err.message || 'Failed to analyze call' })
  }
})

// Get all calls for user
router.get('/', authenticateToken, (req, res) => {
  try {
    // Updated to dbAll
    const calls = dbAll('SELECT id, filename, overallScore, createdAt FROM calls WHERE userId = ? ORDER BY createdAt DESC', [req.user.id])
    res.json(calls)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch calls' })
  }
})

// Get dashboard stats
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id

    // Updated to dbGet
    const totalCalls = dbGet('SELECT COUNT(*) as count FROM calls WHERE userId = ?', [userId])
    const avgScore = dbGet('SELECT AVG(overallScore) as avg FROM calls WHERE userId = ?', [userId])
    const topScore = dbGet('SELECT MAX(overallScore) as max FROM calls WHERE userId = ?', [userId])

    // Calls this week - updated to dbGet
    const thisWeek = dbGet(
      "SELECT COUNT(*) as count FROM calls WHERE userId = ? AND createdAt >= datetime('now', '-7 days')",
      [userId]
    )

    // Updated to dbAll
    const recentCalls = dbAll(
      'SELECT id, filename, overallScore, createdAt FROM calls WHERE userId = ? ORDER BY createdAt DESC LIMIT 5',
      [userId]
    )

    res.json({
      stats: {
        totalCalls: totalCalls.count,
        avgScore: Math.round(avgScore.avg || 0),
        topScore: topScore.max || 0,
        thisWeek: thisWeek.count,
      },
      recentCalls,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
})

// Get single call analysis
router.get('/:id', authenticateToken, (req, res) => {
  try {
    // Updated to dbGet
    const call = dbGet('SELECT * FROM calls WHERE id = ? AND userId = ?', [req.params.id, req.user.id])

    if (!call) {
      return res.status(404).json({ error: 'Call not found' })
    }

    res.json({
      call: {
        id: call.id,
        filename: call.filename,
        transcript: call.transcript,
        overallScore: call.overallScore,
        createdAt: call.createdAt,
      },
      result: JSON.parse(call.analysisResult || '{}'),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch call analysis' })
  }
})

// Re-format existing transcript
router.post('/:id/reformat', authenticateToken, async (req, res) => {
  try {
    const call = dbGet('SELECT transcript FROM calls WHERE id = ? AND userId = ?', [req.params.id, req.user.id])
    if (!call) return res.status(404).json({ error: 'Call not found' })

    console.log('✨ Re-formatting existing transcript...')
    const structuredTranscript = await formatTranscriptWithAI(call.transcript)

    dbRun('UPDATE calls SET transcript = ? WHERE id = ?', [structuredTranscript, req.params.id])
    res.json({ transcript: structuredTranscript })
  } catch (err) {
    res.status(500).json({ error: 'Failed to reformat transcript' })
  }
})

// Delete call
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    // Updated to dbRun
    const result = dbRun('DELETE FROM calls WHERE id = ? AND userId = ?', [req.params.id, req.user.id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Call not found' })
    }

    res.json({ message: 'Call deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete call' })
  }
})

export default router
