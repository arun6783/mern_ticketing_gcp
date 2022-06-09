import {
  Listener,
  NotFoundError,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@sanguinee06-justix/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName = queueGroupName

  subject: Subjects.PaymentCreated = Subjects.PaymentCreated

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new NotFoundError()
    }

    order.set({ status: OrderStatus.Complete })

    await order.save()

    msg.ack()
  }
}
