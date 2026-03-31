import OpenAI from 'openai'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// OpenRouter Client
const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Salyzer AI",
  }
})

// Groq Client for Transcription
const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

// Hugging Face API URL
const HF_API_URL = "https://api-inference.huggingface.co/models/pyannote/speaker-diarization-3.1"

// Define models for parallel racing
const MODELS_TO_RACE = [
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.1-8b-instruct:free",
  "anthropic/claude-3-haiku",
  "google/gemini-flash-1.5",
]

/**
 * Transcribe audio file using Groq or OpenAI with verbose metadata
 */
export async function transcribeAudio(filePath) {
  const hasGroq = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here'
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'

  if (!hasGroq && !hasOpenAI) return null

  try {
    const file = readFileSync(filePath)
    const blob = new Blob([file])
    const formFile = new File([blob], 'audio.mp3', { type: 'audio/mpeg' })

    if (hasGroq) {
      console.log('⚡ Transcription (Groq Whisper Verbose)...')
      return await groq.audio.transcriptions.create({
        file: formFile,
        model: 'whisper-large-v3',
        response_format: 'verbose_json', // CRITICAL: gives us timestamps
      })
    }

    return await openai.audio.transcriptions.create({
      file: formFile,
      model: 'whisper-1',
      response_format: 'verbose_json', 
    })
  } catch (err) {
    console.error('Transcription error:', err)
    throw new Error('Failed to transcribe audio: ' + err.message)
  }
}

/**
 * Diarize audio using Hugging Face Pyannote
 */
export async function diarizeAudio(filePath) {
  const hasHF = process.env.HF_API_KEY && process.env.HF_API_KEY !== 'your_hf_api_key_here'
  if (!hasHF) return null

  try {
    console.log('🗣️ Diarizing (Hugging Face Pyannote)...')
    const audioData = readFileSync(filePath)
    
    const response = await fetch(HF_API_URL, {
      headers: { 
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "audio/mpeg" // Helps HF detect the format
      },
      method: "POST",
      body: audioData,
    })

    if (!response.ok) {
      const errText = await response.text()
      if (errText.includes("currently loading")) {
         console.warn('🕒 Pyannote is loading on HF. Please try again in 30 seconds.')
      } else {
         console.error('❌ HF Diarization Error:', errText)
      }
      return null
    }

    const result = await response.json()
    console.log('✅ Diarization data received successfully.')
    return result
  } catch (err) {
    console.error('Diarization error:', err.message)
    return null
  }
}

/**
 * Smart merge Whisper segments with Pyannote speaker IDs
 */
export function mergeTranscriptAndDiarization(whisperResult, diarizationResult) {
  if (!diarizationResult || !whisperResult.segments) {
    return whisperResult.text || whisperResult
  }

  const segments = whisperResult.segments
  let mergedTranscript = ""
  let currentSpeaker = null

  segments.forEach(seg => {
    const midPoint = (seg.start + seg.end) / 2
    
    // Find who was speaking at the midpoint of this segment
    const speakerTurn = diarizationResult.find(d => midPoint >= d.start && midPoint <= d.end)
    const speakerId = speakerTurn ? speakerTurn.speaker : "UNKNOWN"
    
    // Map SPEAKER_00 to Agent and SPEAKER_01 to Customer (usual pattern)
    const label = speakerId === "SPEAKER_00" ? "Agent" : "Customer"

    if (label !== currentSpeaker) {
      if (currentSpeaker !== null) mergedTranscript += "\n\n"
      mergedTranscript += `${label}: `
      currentSpeaker = label
    }

    mergedTranscript += `${seg.text.trim()} `
  })

  return mergedTranscript.trim()
}

/**
 * Analyze sales call transcript using OpenRouter (Parallel Racing)
 */
export async function analyzeTranscript(transcript, referenceScripts = []) {
  const scriptsContext = referenceScripts.length > 0
    ? `\n\nREFERENCE TOP-PERFORMING SCRIPTS FOR COMPARISON:\n${referenceScripts
        .map((s, i) => `--- Script ${i + 1}: ${s.title} ---\n${s.content}`)
        .join('\n\n')}`
    : ''

  const prompt = `You are an expert sales coach and conversation analyst. Analyze the following sales call transcript and provide a comprehensive assessment.

SALES CALL TRANSCRIPT:
"""
${transcript}
"""
${scriptsContext}

Provide your analysis as a JSON object with the following structure (do NOT include any markdown formatting, just raw JSON):

{
  "scores": {
    "overall": <0-100>,
    "clarity": <0-100>,
    "persuasion": <0-100>,
    "objectionHandling": <0-100>,
    "closing": <0-100>,
    "rapport": <0-100>
  },
  "stages": [
    {
      "name": "<stage name: Opening/Pitch/Discovery/Objection Handling/Closing/etc>",
      "quality": "<strong/moderate/weak>",
      "analysis": "<brief analysis of this stage>"
    }
  ],
  "toneTimeline": [
    {
      "timestamp": "<approximate time marker like 'Early', 'Mid', 'Late' or '0:00-1:00'>",
      "confidence": <0-100 agent confidence level>,
      "customerSentiment": <0-100 customer positivity level>,
      "label": "<brief description>"
    }
  ],
  "toneInsights": "<summary of emotional tone patterns throughout the call>",
  "missedOpportunities": [
    {
      "type": "<Unanswered Objection / Ignored Buying Signal / Missed Upsell / Poor Transition / etc>",
      "description": "<what was missed>",
      "suggestion": "<what should have been done>"
    }
  ],
  "scriptComparison": [
    {
      "context": "<the situation or stage being compared>",
      "userResponse": "<what the agent actually said (quoted or paraphrased)>",
      "idealResponse": "<what a top performer would say>",
      "gap": "<explanation of the difference>"
    }
  ],
  "feedback": [
    {
      "title": "<short improvement area title>",
      "suggestion": "<detailed improvement suggestion>",
      "example": "<example of better phrasing or approach>"
    }
  ]
}

IMPORTANT GUIDELINES:
- Be specific and actionable in all feedback
- Reference actual quotes from the transcript when possible
- Score fairly - don't give a perfect score unless truly exceptional
- Provide at least 3 feedback items and identify at least 2 missed opportunities if applicable
- For script comparison, compare agent responses against the reference scripts if provided
- For tone timeline, provide at least 4-5 data points across the conversation
- All scores should be integers between 0 and 100`

  // Create a list of promises, one for each model
  const analysisPromises = MODELS_TO_RACE.map(async (modelName) => {
    try {
      console.log(`🤖 Requesting analysis from: ${modelName}`)
      const response = await openRouter.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: 'You are a sales performance analyst. Always respond with valid JSON only, no markdown formatting or code blocks.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      })

      const content = response.choices[0].message.content.trim()
      
      // Clean up any markdown formatting
      let cleanJson = content
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }

      const result = JSON.parse(cleanJson)
      console.log(`⚡ ${modelName} responded first and won the race!`)
      return result
    } catch (err) {
      console.error(`❌ Model ${modelName} failed:`, err.message)
      throw err // Re-throw to let Promise.any handle it
    }
  })

  try {
    // Return the first successful response
    return await Promise.any(analysisPromises)
  } catch (err) {
    if (err instanceof AggregateError) {
      throw new Error('All AI models failed to respond. Please check your OpenRouter API key.')
    }
    throw err
  }
}

/**
 * AI-powered transcript formatting (Agent vs Customer)
 */
export async function formatTranscriptWithAI(rawTranscript) {
  try {
    console.log('✨ Formatting transcript with EXTREME speaker detection...')
    const response = await openRouter.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: 'system',
          content: `You are a transcript formatter. Your job is to take a block of text and TURN IT INTO A DIALOGUE.

MANDATORY RULES:
1. You MUST identify the first speaker as "Agent:" and the second as "Customer:".
2. You MUST start a NEW LINE every time a speaker changes.
3. You MUST split the raw text even if sentences are merged together.
4. If you see a greeting followed by a request, split it into Agent and Customer turns.
5. NEVER return a single paragraph.

Example Input: "Hi this is Lauren. Hi Lauren I'm John."
Example Output:
Agent: Hi this is Lauren.

Customer: Hi Lauren I'm John.`,
        },
        {
          role: 'user',
          content: rawTranscript,
        },
      ],
      temperature: 0.1,
    })

    const result = response.choices[0].message.content.trim()
    console.log('✅ Formatting completed. New length:', result.length)
    return result
  } catch (err) {
    console.error('Formatting error:', err.message)
    return rawTranscript // Fallback
  }
}

/**
 * Generate a demo analysis (used when no API key is configured)
 */
export function generateDemoAnalysis(transcript) {
  const wordCount = transcript.split(/\s+/).length
  const sentences = transcript.split(/[.!?]+/).filter(Boolean)

  // Generate pseudo-random scores based on content
  const hash = transcript.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const baseScore = 55 + (hash % 30)

  return {
    scores: {
      overall: Math.min(baseScore + 5, 95),
      clarity: Math.min(baseScore + 8, 95),
      persuasion: Math.min(baseScore - 2, 95),
      objectionHandling: Math.min(baseScore - 5, 95),
      closing: Math.min(baseScore + 2, 95),
      rapport: Math.min(baseScore + 10, 95),
    },
    stages: [
      {
        name: 'Opening',
        quality: baseScore > 70 ? 'strong' : 'moderate',
        analysis: 'The call opening was direct and professional. The agent introduced themselves clearly and stated the purpose of the call.',
      },
      {
        name: 'Discovery',
        quality: 'moderate',
        analysis: 'Some probing questions were asked but the discovery could have gone deeper to uncover underlying pain points.',
      },
      {
        name: 'Pitch',
        quality: baseScore > 65 ? 'strong' : 'weak',
        analysis: 'The value proposition was presented but could be more tailored to the specific needs uncovered in discovery.',
      },
      {
        name: 'Objection Handling',
        quality: 'weak',
        analysis: 'Several objections were received but not all were addressed with strong evidence or social proof.',
      },
      {
        name: 'Closing',
        quality: baseScore > 75 ? 'strong' : 'moderate',
        analysis: 'The close attempt was made but lacked urgency and a clear next-step commitment.',
      },
    ],
    toneTimeline: [
      { timestamp: '0:00-0:30', confidence: 75, customerSentiment: 60, label: 'Opening - Neutral start' },
      { timestamp: '0:30-1:30', confidence: 80, customerSentiment: 65, label: 'Discovery - Building rapport' },
      { timestamp: '1:30-3:00', confidence: 85, customerSentiment: 70, label: 'Pitch - Engaged listener' },
      { timestamp: '3:00-4:00', confidence: 60, customerSentiment: 45, label: 'Objection - Tension rises' },
      { timestamp: '4:00-5:00', confidence: 65, customerSentiment: 55, label: 'Recovery - Partial resolution' },
      { timestamp: '5:00-6:00', confidence: 70, customerSentiment: 60, label: 'Close - Moderate interest' },
    ],
    toneInsights: 'The agent started with moderate confidence that increased during the pitch phase. However, there was a noticeable dip in both confidence and customer sentiment during objection handling, suggesting the agent was caught off-guard. The recovery was partial but the close lacked the energy of the early pitch.',
    missedOpportunities: [
      {
        type: 'Ignored Buying Signal',
        description: 'The customer expressed interest in a specific feature but the agent moved on without exploring it further.',
        suggestion: 'When a customer shows interest, pause and explore that interest. Ask follow-up questions like "What specifically about that feature appeals to you?"',
      },
      {
        type: 'Unanswered Objection',
        description: 'A price concern was raised but addressed too quickly without empathizing or reframing value.',
        suggestion: 'Acknowledge the concern, reframe around ROI: "I understand budget is important. Let me show you how our clients typically see a 3x return within the first quarter."',
      },
      {
        type: 'Missed Upsell',
        description: 'Based on the customer needs discussed, there was an opportunity to mention the premium tier which includes features they seemed interested in.',
        suggestion: 'After confirming interest in the base offering, introduce the premium tier: "Since you mentioned [need], you might want to explore our Pro plan which includes..."',
      },
    ],
    scriptComparison: [
      {
        context: 'Opening the call',
        userResponse: 'Hi, this is [agent] from [company]. How are you today?',
        idealResponse: 'Hi [prospect name], this is [agent] from [company]. I noticed [relevant trigger/research]. I had an idea about how we might help with [specific challenge]. Is this a good time for a quick chat?',
        gap: 'The opening lacks personalization and a specific reason for calling. Top performers reference research or triggers to show preparation.',
      },
      {
        context: 'Handling price objection',
        userResponse: 'Our pricing is competitive in the market.',
        idealResponse: 'I completely understand. Many of our best clients had the same concern initially. What they found was that [specific ROI metric]. Would it help if I shared a case study from a similar company?',
        gap: 'The response is generic. Top performers use social proof, specific metrics, and offer to share evidence.',
      },
    ],
    feedback: [
      {
        title: 'Strengthen Your Discovery Phase',
        suggestion: 'Spend more time understanding the prospect\'s pain points before jumping into the pitch. Use open-ended questions and the SPIN framework (Situation, Problem, Implication, Need-payoff).',
        example: 'Instead of "Do you need our product?", try "Walk me through your current process for handling [specific task]. What challenges have you noticed?"',
      },
      {
        title: 'Handle Objections with Empathy',
        suggestion: 'When prospects raise concerns, first acknowledge and empathize before responding. This builds trust and shows you\'re listening.',
        example: '"That\'s a great point, and I appreciate you bringing it up. Several of our clients felt the same way. Here\'s what changed their mind..."',
      },
      {
        title: 'Create Urgency in Your Close',
        suggestion: 'Your closing lacked urgency. Give prospects a compelling reason to act now, whether it\'s a limited offer, implementation timeline, or competitive pressure.',
        example: '"Based on what you\'ve shared, you\'re losing approximately $X per month on this. If we get started this week, we could have you up and running by [date]. Would that work for your timeline?"',
      },
      {
        title: 'Use More Social Proof',
        suggestion: 'Throughout the call, reference specific customer success stories that are relevant to the prospect\'s industry and challenges.',
        example: '"We recently helped [similar company] increase their [metric] by 40% in just 3 months. They were facing similar challenges with [specific issue]."',
      },
    ],
  }
}
