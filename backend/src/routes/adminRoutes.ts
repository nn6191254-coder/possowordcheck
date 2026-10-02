import { Router } from 'express'
import { z } from 'zod'
import { getAdminDashboard, loginAdmin } from '../controllers/adminController.js'
import { requireAdmin } from '../middleware/auth.js'
import { loginRateLimiter } from '../middleware/rateLimiter.js'

const router = Router()

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(200) })

router.post('/login', loginRateLimiter, (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid login request' } })
  }
  req.body = parsed.data
  return loginAdmin(req, res)
})

router.get('/dashboard', requireAdmin, getAdminDashboard)

export default router
