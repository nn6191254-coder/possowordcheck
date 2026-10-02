import type { Request, Response } from 'express'
import { successResponse } from '../utils/response.js'

export function getHealth(_req: Request, res: Response) {
  return res.status(200).json(successResponse({ status: 'healthy' }))
}
