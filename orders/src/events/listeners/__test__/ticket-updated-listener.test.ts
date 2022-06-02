import { natsWrapper } from '../../../nats-wrapper'

import { TicketUpdatedEvent } from '@sanguinee06-justix/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { TicketUpdatedListener } from '../ticket-updated-listener'

const setup = async () => {
  //create an instance of the listener

  const listener = new TicketUpdatedListener(natsWrapper.client)

  //create and save a ticket to collection
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  //create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'concert updated',
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  //return all
  return {
    ticket,
    listener,
    data,
    msg,
  }
}

it('finds , updates and saves a ticket', async () => {
  const { ticket, listener, data, msg } = await setup()
  //call the onMessage function with the data object + message object

  await listener.onMessage(data, msg)

  const ticketUpdated = await Ticket.findById(data.id)
  expect(ticketUpdated).toBeDefined()

  expect(ticketUpdated!.title).toEqual(data.title)
  expect(ticketUpdated!.price).toEqual(data.price)
  expect(ticketUpdated!.version).toEqual(data.version)

  expect(ticketUpdated!.title).not.toEqual(ticket.title)
  expect(ticketUpdated!.price).not.toEqual(ticket.price)
})

it('acks the message', async () => {
  const { ticket, listener, data, msg } = await setup()
  //call the onMessage function with the data object + message object

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
  const { ticket, listener, data, msg } = await setup()
  //call the onMessage function with the data object + message object
  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
