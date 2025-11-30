import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { LoginUseCase } from '../../application/useCases/LoginUseCase'

export class LoginHTTPController {
  constructor() {}

  static create = () => {
    return new LoginHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { username, email, password } = req.body
      const response = await LoginUseCase.create({ req }).execute({
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
