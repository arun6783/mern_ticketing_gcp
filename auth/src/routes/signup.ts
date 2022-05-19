import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { BadRequestError } from '../errors/badrequest-error'
import { RequestValidationError } from '../errors/request-validation-errors'
import { User } from '../models/users'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      //return res.status(400).send(errors.array())
      throw new RequestValidationError(errors.array())
    }
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('Email already exists')
    }
    //todo hash password

    const user = User.build({ email, password })
    await user.save()

    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    )

    req.session = { jwt: userJwt }

    res.status(201).send(user)

    // new User({ email, password })
  }
)

export { router as signupRouter }
