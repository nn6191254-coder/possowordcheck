import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/server.js'

describe('SecureCheck API', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.status).toBe('healthy')
  })

  it('returns published security tips', async () => {
    const response = await request(app).get('/api/security-tips')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  it('validates feedback payloads', async () => {
    const response = await request(app).post('/api/feedback').send({ rating: 7, message: 'Test', category: 'general' })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  })

  it('validates contact payloads', async () => {
    const response = await request(app).post('/api/contact').send({ email: 'bad-email', name: 'A', subject: 'x', message: 'short' })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  })

  it('accepts a valid admin login', async () => {
    const response = await request(app).post('/api/admin/login').send({
      email: 'admin@securecheck.local',
      password: 'ChangeMeStrongly!',
    })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.user.role).toBe('admin')
  })

  it('blocks unauthorized admin access', async () => {
    const response = await request(app).get('/api/admin/dashboard')

    expect(response.status).toBe(401)
  })
})
