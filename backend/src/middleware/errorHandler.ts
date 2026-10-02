import type { NextFunction, Request, Response } from 'express'
import { errorResponse } from '../utils/response.js'

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json(errorResponse('NOT_FOUND', 'Resource not found'))
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (typeof error === 'object' && error && 'statusCode' in error) {
    const maybeStatus = error as { statusCode?: number; message?: string }
    return res.status(maybeStatus.statusCode ?? 500).json(
      errorResponse('SERVER_ERROR', maybeStatus.message ?? 'Something went wrong'),
    )
  }

  return res.status(500).json(errorResponse('SERVER_ERROR', 'An unexpected error occurred'))
}
