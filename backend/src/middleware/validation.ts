import type { NextFunction, Request, Response } from 'express'
import { ZodError, z } from 'zod'
import { errorResponse } from '../utils/response.js'

const idSchema = z.string().min(1).max(100)

export const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body)
      req.body = parsed
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid request'))
      }
      return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid request'))
    }
  }
}

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const result = idSchema.safeParse(req.params.id)
  if (!result.success) {
    return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid ID'))
  }
  next()
}
