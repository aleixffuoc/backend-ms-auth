import { NextFunction, Request, Response } from 'express'
import { SignUpService } from '../../application/services/SignUpService'
import { UserEmailValueObject } from '../../domain/valueObjects/UserEmailValueObject'
import { UsernameValueObject } from '../../domain/valueObjects/UsernameValueObject'
import { UserPasswordValueObject } from '../../domain/valueObjects/UserPasswordValueObject'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'

export class SignUpHTTPController {
  static create = () => {
    return new SignUpHTTPController()
  }
  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { email, username, password } = req.body

      const emailVO = UserEmailValueObject.create({ email })
      const usernameVO = UsernameValueObject.create({ username })
      const passwordVO = UserPasswordValueObject.create({ password })

      const response = await SignUpService.create().execute({
        email: emailVO,
        username: usernameVO,
        password: passwordVO,
      })

      res.status(200).json(response)
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = AuthError.create({ message: `[${SignUpHTTPController.name}#execute] ${error.message}`, type: ErrorType.SIGN_UP, status })
      next(authError)
    }
  }
}
