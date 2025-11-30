import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { ConfirmSignUpService } from '../../application/services/ConfirmSignUpService'
import { UsernameValueObject } from '../../domain/valueObjects/UsernameValueObject'

export class ConfirmSignUpHTTPController {
  static create = () => {
    return new ConfirmSignUpHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { username, confirmationCode } = req.body
      const usernameVO = UsernameValueObject.create({ username })
      await ConfirmSignUpService.create({ req }).execute({
        username: usernameVO,
        confirmationCode,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${ConfirmSignUpHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.CONFIRM_SIGN_UP,
        status,
      })
      next(authError)
    }
  }
}
