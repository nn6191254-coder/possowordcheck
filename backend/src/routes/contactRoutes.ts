import { Router } from 'express'
import { z } from 'zod'
import { createContactMessage } from '../controllers/contactController.js'
import { contactRateLimiter } from '../middleware/rateLimiter.js'

const router = Router()

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(100),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
})

router.post('/', contactRateLimiter, (req, res, next) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid contact request' } })
  }
  req.body = parsed.data
  return createContactMessage(req, res)
})

export default router
