import { Response } from 'express'
import { AuthError, ErrorType } from '../errors/AuthError'

export const errorHandler = ({ err, res }: { err: AuthError | any; res: Response }) => {
  if (!(err instanceof AuthError)) {
    const error = new AuthError({ message: err.message || 'Generic Error', type: ErrorType.GENERIC, status: 500 })
    const { status, message, type, stack } = error
    res.status(status).json({ message, type, stack })
  }

  const { status, message, type, stack } = err
  res.status(status).json({ message, type, stack })
}
