import 'express-async-errors'
import { app } from './app'
import { connectDB } from './db/connect'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  try {
    await natsWrapper.connect('ticketing', 'ticketssrv', 'http://nats-srv:4222')

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!!')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client!.close())
    process.on('SIGTERM', () => natsWrapper.client!.close())

    await connectDB(process.env.MONGO_URI)
    console.log('Connected to MongoDb')
  } catch (err) {
    console.log('error occured when trying to connecct to mongo', err)
  }
  const port = 3000
  app.listen(port, () =>
    console.log(`tickets app listening on port ${port}!!!!!`)
  )
}
start()
