const express = require('express')
import 'express-async-errors'
import { json } from 'body-parser'
import { NotFoundError } from './errors/not-found-error'
import { errorHandler } from './middlewares/error-handler'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

const app = express()
app.use(json())
const port = 3000

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!!!!!`)
)
