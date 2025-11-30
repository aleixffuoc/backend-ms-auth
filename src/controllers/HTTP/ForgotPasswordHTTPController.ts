import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { ForgotPasswordUseCase } from '../../application/useCases/ForgotPasswordUseCase'

export class ForgotPasswordHTTPController {
  static create = () => {
    return new ForgotPasswordHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { username } = req.body
      await ForgotPasswordUseCase.create({ req }).execute({
        username,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${ForgotPasswordHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.FORGOT_PASSWORD,
        status,
      })
      next(authError)
    }
  }
}
