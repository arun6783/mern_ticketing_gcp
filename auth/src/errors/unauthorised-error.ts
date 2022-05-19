import { CustomError } from './custom-error'

export class NotAuthorisedError extends CustomError {
  statusCode = 401

  constructor() {
    super('not authorised error')
    Object.setPrototypeOf(this, NotAuthorisedError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Not Authorised' }]
  }
}
