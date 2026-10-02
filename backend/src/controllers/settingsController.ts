import type { Request, Response } from 'express'
import { successResponse } from '../utils/response.js'

const settings = {
  appName: 'SecureCheck',
  mode: 'local-only',
  maintenance: false,
}

export function getSettings(_req: Request, res: Response) {
  return res.status(200).json(successResponse(settings))
}

export function updateSettings(req: Request, res: Response) {
  const { key, value } = req.body as { key?: string; value?: string }
  if (!key || value === undefined) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Setting key and value are required' } })
  }
  return res.status(200).json(successResponse({ key, value, updatedAt: new Date().toISOString() }))
}
