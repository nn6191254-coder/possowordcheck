import type { Request, Response } from 'express'
import { z } from 'zod'
import { successResponse } from '../utils/response.js'

const tips = [
  { id: 'tip-1', title: 'Use Long Passwords', category: 'passwords', priority: 'high', isPublished: true, description: 'Longer passwords are harder for attackers to guess.' },
  { id: 'tip-2', title: 'Avoid Password Reuse', category: 'passwords', priority: 'high', isPublished: true, description: 'Unique passwords reduce impact if one account is exposed.' },
  { id: 'tip-3', title: 'Use a Password Manager', category: 'passwords', priority: 'medium', isPublished: true, description: 'A password manager stores strong, unique secrets safely.' },
  { id: 'tip-4', title: 'Enable Multi-Factor Authentication', category: 'security', priority: 'high', isPublished: true, description: 'MFA adds a second barrier even when passwords are compromised.' },
]

export function getSecurityTips(req: Request, res: Response) {
  const category = req.query.category as string | undefined
  const results = category ? tips.filter((tip) => tip.category === category && tip.isPublished) : tips.filter((tip) => tip.isPublished)
  return res.status(200).json(successResponse(results))
}

export const createTipSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10).max(500),
  category: z.enum(['passwords', 'security', 'general']).default('general'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  isPublished: z.boolean().default(true),
})

export function createSecurityTip(req: Request, res: Response) {
  const { title, description, category, priority, isPublished } = req.body
  const item = {
    id: `tip-${Date.now()}`,
    title,
    description,
    category,
    priority,
    isPublished,
  }
  tips.unshift(item)
  return res.status(201).json(successResponse(item))
}

export function updateSecurityTip(req: Request, res: Response) {
  const item = tips.find((tip) => tip.id === req.params.id)
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tip not found' } })
  Object.assign(item, req.body)
  return res.status(200).json(successResponse(item))
}

export function deleteSecurityTip(req: Request, res: Response) {
  const index = tips.findIndex((tip) => tip.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tip not found' } })
  }
  tips.splice(index, 1)
  return res.status(200).json(successResponse({ deleted: true }))
}
