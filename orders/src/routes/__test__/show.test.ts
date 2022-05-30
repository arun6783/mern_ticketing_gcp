import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('fetches the order ', async () => {
  //create a ticket
  const ticket = Ticket.build({ title: 'concert', price: 20 })
  await ticket.save()

  //make a request to build an order with this ticket

  const user = global.signin()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make a request to fetch the order

  const orderResposne = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(order.id).toEqual(orderResposne.body.id)
})

it('returns 401 if one user tries to fetch others the order ', async () => {
  //create a ticket
  const ticket = Ticket.build({ title: 'concert', price: 20 })
  await ticket.save()

  //make a request to build an order with this ticket

  const user = global.signin()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make a request to fetch the order

  const orderResposne = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})
