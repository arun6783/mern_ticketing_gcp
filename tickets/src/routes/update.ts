import {
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@sanguinee06-justix/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.put(
  '/api/tickets/:id',
  requireAuth,

  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError()
    }

    ticket.set({ title: req.body.title, price: req.body.price })

    await ticket.save()
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
    })

    res.status(200)
  }
)

export { router as updateTicketRoute }
