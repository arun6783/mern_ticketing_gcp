import request from 'supertest'
import { app } from '../../app'

describe('Signup tests happy path', () => {
  const signupUri = '/api/users/signup'
  let requestBody = {
    email: 'test@test.com',
    password: 'password',
  }
  it('awaits a 201 on successful signup', async () => {
    await request(app).post(signupUri).send(requestBody).expect(201)
  })
  it('awaits a 400 with an invalid email ', async () => {
    requestBody.email = ''
    await request(app).post(signupUri).send(requestBody).expect(400)
  })
  it('awaits a 400 with an invalid password ', async () => {
    requestBody.password = 'asd'
    await request(app).post(signupUri).send(requestBody).expect(400)
  })
  it('awaits a 400 with an missing email and  password ', async () => {
    await request(app).post(signupUri).send({}).expect(400)
  })
})

describe('Signup duplicate email tests', () => {
  const signupUri = '/api/users/signup'
  let requestBody = {
    email: 'test@test.com',
    password: 'password',
  }
  it('awaits 400 for duplicate emails', async () => {
    await request(app).post(signupUri).send(requestBody).expect(201)
    await request(app).post(signupUri).send(requestBody).expect(400)
  })
})

describe('cookie tests during signup', () => {
  const signupUri = '/api/users/signup'
  let requestBody = {
    email: 'test@test.com',
    password: 'password',
  }
  it('should not set cookie in non prod environments', async () => {
    const response = await request(app)
      .post(signupUri)
      .send(requestBody)
      .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined()
  })
})
