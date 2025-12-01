import { NextFunction, Request, Response } from 'express'
import { LoginUseCase } from '../../application/useCases/LoginUseCase'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'

export class LoginHTTPController {
  constructor() {}

  static create = () => {
    return new LoginHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { username, email, password } = req.body
      const response = await LoginUseCase.create().execute({
        username,
        email,
        password,
      })

      res.status(200).json(response)
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = AuthError.create({ message: `[${LoginHTTPController.name}#execute] ${error.message}`, type: ErrorType.LOGIN, status })
      next(authError)
    }
  }
}
