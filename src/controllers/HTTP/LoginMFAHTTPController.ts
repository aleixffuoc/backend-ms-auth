import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { LoginMFAUseCase } from '../../application/useCases/LoginMFAUseCase'

export class LoginMFAHTTPController {
  constructor() {}

  static create = () => {
    return new LoginMFAHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { username, email, sessionToken, code } = req.body
      const response = await LoginMFAUseCase.create({ req }).execute({
        username,
        email,
        sessionToken,
        code,
      })

      res.status(200).json(response)
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = AuthError.create({ message: `[${LoginMFAHTTPController.name}#execute] ${error.message}`, type: ErrorType.LOGIN_MFA, status })
      next(authError)
    }
  }
}
