import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
} from '@sanguinee06-justix/common'
import { Message } from 'node-nats-streaming'
import { markAsUntransferable } from 'worker_threads'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'
import { queueGroupName } from './queue-group-name'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName
  readonly subject = Subjects.ExpirationComplete
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')
    if (!order) {
      throw new Error('Order Not found')
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }
    order.set({
      status: OrderStatus.Cancelled,
    })
    await order.save()

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    })
    msg.ack()
  }
}
