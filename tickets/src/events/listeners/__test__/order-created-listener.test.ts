import { OrderStatus, OrderCreatedEvent } from '@sanguinee06-justix/common'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  //create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'asdasd',
  })
  await ticket.save()
  //create fake data of type ordercreatedevent
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdasd',
    expiresAt: new Date().toString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, ticket, data, msg }
}

it('sets orderid in ticket if ticket exists and a proper order was created', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('ack message ', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  //@ts-ignore
  const logs = natsWrapper.client.publish.mock.calls[0][1]
  const ticketUpdatedData = JSON.parse(logs)

  expect(ticketUpdatedData.orderId).toEqual(data.id)
})
