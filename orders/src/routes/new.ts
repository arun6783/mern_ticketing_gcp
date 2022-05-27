import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@sanguinee06-justix/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

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
    const { ticketId } = req.body

    //find the ticket user is trying to order in the db
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    //make sure ticket is not already reserved

    //run query to look at all orders. find an order where the ticket is = ot the ticket as above **and** the order status is **not** cancelled
    //if we find an order from that means the ticket *is* reserved

    const existingOrder = await ticket.isReserved()

    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved')
    }
    //calculate an expiration date (15 mins)

    const expiration = new Date()

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    //build the order and save to database

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    })

    await order.save()
    // publish an event saying that an order was created

    res.status(201).send(order)
  }
)

export { router as createOrderRouter }
