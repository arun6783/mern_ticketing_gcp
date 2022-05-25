import request from 'supertest'
import { Cookie } from 'cookiejar'
const agent = request.agent()

import { app } from '../../app'

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401)
})
it('returns a status other than 401 if the user is signed in', async () => {
  var Cookies = global.signin()
  var req = request(app).post('/api/tickets')
  req.cookies = Cookies[0]
  // req.session = Cookies[1]
  console.log('keus', Object.keys(req))
  const response = await req.send({})
  expect(response.status).not.toEqual(401)
})

it('returnes an error if an invalid title is provided', async () => {})

it('returnes an error if an invalid price is provided', async () => {})

it('creates a ticket with valid inputs', async () => {})
