import { connect, Message } from 'node-nats-streaming'
import { TicketCreatedPublisher } from '@sanguinee06-justix/common'
console.clear()
const stan = connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher connected to NATS')

  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '123',
      title: 'New Concert using common',
      price: 200,
    })
  } catch (err) {
    console.log(err)
  }
})
