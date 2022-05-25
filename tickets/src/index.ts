import 'express-async-errors'
import { app } from './app'
import { connectDB } from './db/connect'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  try {
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
