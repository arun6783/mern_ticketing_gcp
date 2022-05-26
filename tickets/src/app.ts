import * as dotenv from 'dotenv'
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@sanguinee06-justix/common'
import { createTicketRouter } from './routes/new'
import cookieSession from 'cookie-session'
import { showTicketRouter } from './routes/show'
import { getTicketsRoute } from './routes'
import { updateTicketRoute } from './routes/update'

dotenv.config()
const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(
  cookieSession({
    signed: false,
    secure: false, //process.env.NODE_ENV
  })
)

app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(getTicketsRoute)
app.use(updateTicketRoute)
app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
