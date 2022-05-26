import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)
})
describe('Tickets tests with signin', () => {
  const getReq = () => {
    let req = request(app).post('/api/tickets').set('Cookie', global.signin())

    return req
  }

  it('returns a status other than 401 if the user is signed in', async () => {
    let req = getReq()
    const response = await req.send({})

    expect(response.status).not.toEqual(401)
  })

  it('returns an error if an invalid title is provided', async () => {
    let req = getReq()
    await req.send({ title: '', price: 10 }).expect(400)

    await req.send({ price: 10 }).expect(400)
  })

  it('returns an error if an invalid price is provided', async () => {
    let req = getReq()
    await req.send({ title: 'title here', price: -10 }).expect(400)
    await req.send({ title: 'title here' }).expect(400)
  })

  it('creates a ticket with valid inputs', async () => {
    let req = getReq()
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const ticket = { title: 'First ticket', price: 10 }
    await req.send(ticket).expect(201)
    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].title).toEqual(ticket.title)
    expect(tickets[0].price).toEqual(ticket.price)
  })

  it('publishes an event after creating a ticket', async () => {
    let req = getReq()
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const ticket = { title: 'First ticket', price: 10 }
    await req.send(ticket).expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })
})
