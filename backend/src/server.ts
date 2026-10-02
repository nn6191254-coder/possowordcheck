import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import { generalRateLimiter } from './middleware/rateLimiter.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import healthRoutes from './routes/healthRoutes.js'
import tipsRoutes from './routes/tipsRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { logger } from './utils/logger.js'

const app = express()

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.disable('x-powered-by')
app.use(cors({ origin: env.frontendUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(generalRateLimiter)

app.use('/api/health', healthRoutes)
app.use('/api/security-tips', tipsRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

const startServer = () => {
  app.listen(env.port, () => {
    logger.info(`SecureCheck API started on port ${env.port}`)
  })
}

if (process.env.NODE_ENV !== 'test') {
  startServer()
}

export { app, startServer }
