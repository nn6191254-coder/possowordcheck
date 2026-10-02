import { Router } from 'express'
import { z } from 'zod'
import { createFeedback } from '../controllers/feedbackController.js'
import { feedbackRateLimiter } from '../middleware/rateLimiter.js'

const router = Router()

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().min(2).max(500),
  category: z.string().min(2).max(40),
})

router.post('/', feedbackRateLimiter, (req, res, next) => {
  const parsed = feedbackSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid feedback submission' } })
  }
  req.body = parsed.data
  return createFeedback(req, res)
})

export default router
