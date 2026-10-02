import type { Request, Response } from 'express'
import { z } from 'zod'
import { successResponse } from '../utils/response.js'

const contactSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.string().email().max(100),
  subject: z.string().min(3).max(120).trim(),
  message: z.string().min(10).max(2000).trim(),
})

export function createContactMessage(req: Request, res: Response) {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid contact request' } })
  }

  return res.status(201).json(successResponse({
    id: `contact-${Date.now()}`,
    ...parsed.data,
    status: 'queued',
  }))
}
