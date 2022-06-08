import {
  BadRequestError,
  NotAuthorisedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@sanguinee06-justix/common'
import { Order } from '../models/order'

import express, { request, Request, Response } from 'express'

import { body } from 'express-validator'
import { stripe } from '../stripe'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('cannot pay for an cancelled order')
    }

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100, /// stripe charges in cents
      source: token,
    })

    res.status(201).send({ success: true })
  }
)

export { router as createChargeRouter }
