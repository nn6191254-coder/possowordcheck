import type { Request, Response } from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { successResponse } from '../utils/response.js'

const adminPasswordHashPromise = argon2.hash(env.adminPassword)

export async function loginAdmin(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } })
  }

  if (email !== env.adminEmail) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } })
  }

  const adminPasswordHash = await adminPasswordHashPromise
  const passwordMatches = await argon2.verify(adminPasswordHash, password)

  if (!passwordMatches) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } })
  }

  const token = jwt.sign({ email, role: 'admin' }, env.jwtSecret, { expiresIn: '8h' })
  res.cookie('securecheck_admin', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  })

  return res.status(200).json(successResponse({
    token,
    user: { email, role: 'admin' },
  }))
}

export function getAdminDashboard(_req: Request, res: Response) {
  return res.status(200).json(successResponse({
    totalFeedback: 14,
    averageRating: 4.5,
    contactMessages: 3,
    publishedSecurityTips: 6,
    applicationEvents: 58,
    systemStatus: 'healthy',
  }))
}
