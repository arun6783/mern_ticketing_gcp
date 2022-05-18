import express from 'express'
import { User } from '../models/users'

const router = express.Router()

router.get('/api/users/currentuser', async (req, res) => {
  let users = await User.find({})
  res.status(200).json({ users })
})

export { router as currentUserRouter }
