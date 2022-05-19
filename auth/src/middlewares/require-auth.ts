import { Request, Response, NextFunction } from 'express'
import { NotAuthorisedError } from '../errors/unauthorised-error'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorisedError()
  }
  next()
}
