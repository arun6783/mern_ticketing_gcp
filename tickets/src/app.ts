import * as dotenv from 'dotenv'
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { NotFoundError, errorHandler } from '@sanguinee06-justix/common'
import cookieSession from 'cookie-session'
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

app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
