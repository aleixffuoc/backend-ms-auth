import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { ConfirmForgotPasswordUseCase } from '../../application/useCases/ConfirmForgotPasswordUseCase'

export class ConfirmForgotPasswordHTTPController {
  static create = () => {
    return new ConfirmForgotPasswordHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { username, confirmationCode, password } = req.body
      await ConfirmForgotPasswordUseCase.create({ req }).execute({
        username,
        confirmationCode,
        password,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${ConfirmForgotPasswordHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.CONFIRM_FORGOT_PASSWORD,
        status,
      })
      next(authError)
    }
  }
}
