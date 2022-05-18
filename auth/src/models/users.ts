import mongoose from 'mongoose'
import { Password } from '../services/password'

interface UserAttr {
  email: string
  password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttr): UserDoc
}

interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

//quick reminder this function keyword helps to use this keyword inside the method. if you use arrow function, then this keyword is not related
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'))
    this.set('password', hashedPassword)
  }
  done()
})

userSchema.statics.build = (attrs: UserAttr) => {
  return new User(attrs)
}
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
