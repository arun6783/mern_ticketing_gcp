import { OrderCreatedEvent, OrderStatus } from '@sanguinee06-justix/common'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedEventListener } from '../order-created-event-listener'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCreatedEventListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'asdasd',
    userId: 'asdasd',
    status: OrderStatus.Created,
    ticket: {
      id: 'asdasd',
      price: 222,
    },
  }

  //@ts-ignore

  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const savedOrder = await Order.findById(data.id)

  expect(savedOrder!.price).toEqual(data.ticket.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
