import { requireAuth, validateRequest } from '@sanguinee06-justix/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
const router = express.Router()

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId is not valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send('post orders response')
  }
)

export { router as createOrderRouter }
