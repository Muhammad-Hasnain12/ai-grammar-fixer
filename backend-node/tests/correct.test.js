import request from 'supertest'
import app from '../src/app.js'

// Mock global fetch
global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ corrected_text: 'Hello world.' }) }))

describe('POST /api/correct', () => {
  it('returns corrected text', async () => {
    const res = await request(app).post('/api/correct').send({ text: 'Helo world.' })
    expect(res.statusCode).toBe(200)
    expect(res.body.corrected_text).toBe('Hello world.')
  })

  it('validates empty input', async () => {
    const res = await request(app).post('/api/correct').send({ text: '' })
    expect(res.statusCode).toBe(400)
  })
})


