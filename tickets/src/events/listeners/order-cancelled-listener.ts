import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from '@sanguinee06-justix/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { queueGroupName } from './queue-group-name'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled

  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //find the ticket that the order is reserving

    const ticket = await Ticket.findById(data.ticket.id)
    //if no ticket throw error

    if (!ticket) throw new Error('ticket not found')

    //mark the ticket as being cancelled by removing its orderid property

    ticket.set({ orderId: undefined })
    //save the ticket
    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: data.id,
    })

    //ack the message
    msg.ack()
  }
}
