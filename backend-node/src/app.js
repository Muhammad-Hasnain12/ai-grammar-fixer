import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json({ limit: '1mb' }))

const corsOrigin = process.env.CORS_ORIGIN || '*'
if (corsOrigin) {
  app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(s => s.trim()) }))
}

// Rate limit stub (enable in production with a real store, e.g., Upstash or Redis)
// import rateLimit from 'express-rate-limit'
// const limiter = rateLimit({ windowMs: 60_000, max: 30 })
// app.use(limiter)

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'
const USE_HF_INFERENCE_API = (process.env.USE_HF_INFERENCE_API || 'false').toLowerCase() === 'true'
const HF_INFERENCE_API_URL = process.env.HF_INFERENCE_API_URL || ''
const HF_INFERENCE_API_TOKEN = process.env.HF_INFERENCE_API_TOKEN || ''
const HF_DEFAULT_MODEL = process.env.HF_DEFAULT_MODEL || 'vennify/t5-base-grammar-correction'

async function callPythonService(text) {
  const res = await fetch(`${PYTHON_SERVICE_URL}/correct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error(`Python service error: ${res.status}`)
  return res.json()
}

async function callHuggingFace(text) {
  const modelUrl = HF_INFERENCE_API_URL || `https://api-inference.huggingface.co/models/${HF_DEFAULT_MODEL}`
  const payload = { inputs: text }
  const headers = {
    'Content-Type': 'application/json',
    ...(HF_INFERENCE_API_TOKEN ? { Authorization: `Bearer ${HF_INFERENCE_API_TOKEN}` } : {}),
  }
  const res = await fetch(modelUrl, { method: 'POST', headers, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(`HF Inference API error: ${res.status}`)
  const data = await res.json()
  const output = Array.isArray(data) && data.length && (data[0].generated_text || data[0].summary_text)
  return { corrected_text: output || String(text) }
}

app.post('/api/correct', async (req, res) => {
  try {
    const { text } = req.body || {}
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid input: provide non-empty text' })
    }
    const clean = String(text).slice(0, 8000)
    const result = USE_HF_INFERENCE_API ? await callHuggingFace(clean) : await callPythonService(clean)
    return res.json({ corrected_text: result.corrected_text || '', corrections: result.corrections || [] })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal error' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

export default app


