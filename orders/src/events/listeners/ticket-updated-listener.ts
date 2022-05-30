import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from '@sanguinee06-justix/common'
import { Message } from 'node-nats-streaming'
import { title } from 'process'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedEventListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }
    const { title, price } = data
    ticket.set({ title: title, price: price })

    await ticket.save()

    msg.ack()
  }
}
