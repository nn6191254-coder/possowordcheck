import type { Request, Response } from 'express'
import { z } from 'zod'
import { successResponse } from '../utils/response.js'

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().min(2).max(500).trim(),
  category: z.enum(['general', 'feature', 'usability', 'security']).default('general'),
})

export function createFeedback(req: Request, res: Response) {
  const parsed = feedbackSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid feedback submission' } })
  }

  return res.status(201).json(successResponse({
    id: `feedback-${Date.now()}`,
    ...parsed.data,
  }))
}
