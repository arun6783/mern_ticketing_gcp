import * as dotenv from 'dotenv'
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@sanguinee06-justix/common'
import cookieSession from 'cookie-session'
import { indexOrderRouter } from './routes'
import { showOrderRouter } from './routes/show'
import { createOrderRouter } from './routes/new'
import { deleteOrderRouter } from './routes/delete'

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
app.use(showOrderRouter)
app.use(indexOrderRouter)

app.use(createOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
