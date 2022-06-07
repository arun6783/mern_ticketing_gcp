import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'

import mongoose from 'mongoose'
import { OrderStatus, OrderCancelledEvent } from '@sanguinee06-justix/common'
import { Order } from '../../../models/order'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 1,
    price: 10,
    userId: 'asdasd',
  })

  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 'asdasd',
    },
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('updates the status of the order', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(data.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should ack the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
