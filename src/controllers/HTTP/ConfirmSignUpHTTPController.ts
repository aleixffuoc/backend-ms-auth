import { NextFunction, Request, Response } from 'express'
import { ConfirmSignUpService } from '../../application/services/ConfirmSignUpService'
import { UsernameValueObject } from '../../domain/valueObjects/UsernameValueObject'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'

export class ConfirmSignUpHTTPController {
  static create = () => {
    return new ConfirmSignUpHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { username, confirmationCode } = req.body
      const usernameVO = UsernameValueObject.create({ username })
      await ConfirmSignUpService.create().execute({
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
