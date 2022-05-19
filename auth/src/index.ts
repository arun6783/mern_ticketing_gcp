import * as dotenv from 'dotenv'
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { NotFoundError } from './errors/not-found-error'
import { errorHandler } from './middlewares/error-handler'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { connectDB } from './db/connect'
import cookieSession from 'cookie-session'

dotenv.config()
const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)
const port = 3000

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  try {
    await connectDB(process.env.ATLAS_URI ?? '')
    console.log('Connected to MongoDb')
  } catch (err) {
    console.log('error occured when trying to connecct to mongo', err)
  }

  app.listen(port, () =>
    console.log(`Example app listening on port ${port}!!!!!`)
  )
}
start()
