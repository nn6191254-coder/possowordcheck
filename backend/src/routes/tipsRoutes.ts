import { Router } from 'express'
import { createSecurityTip, deleteSecurityTip, getSecurityTips, updateSecurityTip, createTipSchema } from '../controllers/tipsController.js'
import { requireAdmin } from '../middleware/auth.js'
import { validateRequest, validateId } from '../middleware/validation.js'

const router = Router()

router.get('/', getSecurityTips)
router.post('/', requireAdmin, validateRequest(createTipSchema), createSecurityTip)
router.put('/:id', requireAdmin, validateId, validateRequest(createTipSchema), updateSecurityTip)
router.delete('/:id', requireAdmin, validateId, deleteSecurityTip)

export default router
