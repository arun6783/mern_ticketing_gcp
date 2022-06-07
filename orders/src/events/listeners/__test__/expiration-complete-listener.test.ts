import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteEvent } from '@sanguinee06-justix/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { Order, OrderStatus } from '../../../models/order'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    title: 'new concert',
    price: 202,
    id: new mongoose.Types.ObjectId().toHexString(),
  })

  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asddd',
    expiresAt: new Date(),
    ticket,
  })
  await order.save()
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  //@ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, order, data, msg }
}

it('should set order status to cancelled ', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should emit order cancelled event', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const publishedEvent = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(publishedEvent.id).toEqual(order.id)
})

it('ack the message', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
