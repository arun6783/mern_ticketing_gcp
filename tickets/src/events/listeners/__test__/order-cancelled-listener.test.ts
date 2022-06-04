import {
  OrderStatus,
  OrderCreatedEvent,
  OrderCancelledEvent,
} from '@sanguinee06-justix/common'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCancelledListener } from '../order-cancelled-listener'
const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  //create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'asdasd',
  })
  ticket.set({ orderId })
  await ticket.save()
  //create fake data of type ordercreatedevent
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, ticket, data, msg, orderId }
}

it('unsets orderid in ticket if ticket exists and a proper order was cancelled', async () => {
  const { listener, ticket, data, msg, orderId } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(undefined)
  expect(updatedTicket!.orderId).not.toEqual(orderId)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  expect(msg.ack).toHaveBeenCalled()
})
