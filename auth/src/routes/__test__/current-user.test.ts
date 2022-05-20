import request from 'supertest'
import { app } from '../../app'

it('responds with details about the current user', async () => {
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
  const signupCookie = signupResponse.get('Set-Cookie')

  const response = await request(app)
    .post('/api/users/currentuser')
    .set('Cookie', signupCookie)
    .send()
    .expect(200)

  expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('responds with null if not authenticated', async () => {
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
  const response = await request(app)
    .post('/api/users/currentuser')
    .send()
    .expect(200)
  expect(response.body.currentUser.email).toEqual('test@test.com')
})
