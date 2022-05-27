import mongoose, { ConnectOptions } from 'mongoose'

export const connectDB = (url: string) => {
  if (url === '') throw new Error('Invalid mongo url')
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  } as ConnectOptions)
}
