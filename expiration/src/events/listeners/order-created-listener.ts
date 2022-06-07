import {
  Listener,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@sanguinee06-justix/common'
import { Message } from 'node-nats-streaming'
import { expirationQueue } from '../../queues/expiration-queue'
import { queueGroupName } from './queueGroupName'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    console.log('waiting this many ms to process', delay)
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    )

    msg.ack()
  }
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName
}
