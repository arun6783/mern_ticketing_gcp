import express from 'express'

const router = express.Router()

router.post('/api/users/signin', (req, res) => {
  res.send('Hi signin user!!')
})

export { router as signinRouter }
