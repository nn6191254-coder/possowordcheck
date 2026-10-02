import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { errorResponse } from '../utils/response.js'

export interface AuthenticatedRequest extends Request {
  user?: { email: string; role: string }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.securecheck_admin || req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication required'))
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { email: string; role: string }
    req.user = payload
    if (payload.role !== 'admin') {
      return res.status(403).json(errorResponse('FORBIDDEN', 'Admin access only'))
    }
    return next()
  } catch {
    return res.status(401).json(errorResponse('UNAUTHORIZED', 'Invalid or expired session'))
  }
}
