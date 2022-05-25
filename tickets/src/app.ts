import * as dotenv from 'dotenv'
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@sanguinee06-justix/common'
import { createTicketRouter } from './routes/new'

const app = express()

dotenv.config()

app.set('trust proxy', true)

app.use(json())

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)
app.use(currentUser)

app.use(createTicketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

console.log('inticketauth-env', process.env)

app.use(errorHandler)

export { app }
