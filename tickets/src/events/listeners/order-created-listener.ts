import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@sanguinee06-justix/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //find the ticket that the order is reserving

    const ticket = await Ticket.findById(data.ticket.id)
    //if no ticket throw error

    if (!ticket) throw new Error('ticket not found')

    //mark the ticket as being reserverd by setting its orderid property

    ticket.set({ orderId: data.id })
    //save the ticket
    await ticket.save()
    //ack the message
    msg.ack()
  }
}
