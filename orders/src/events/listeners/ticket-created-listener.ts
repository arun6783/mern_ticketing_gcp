import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from '@sanguinee06-justix/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketCreatedEventListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = queueGroupName
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data

    const ticket = Ticket.build({ id: id, title, price })

    await ticket.save()

    msg.ack()
  }
}
