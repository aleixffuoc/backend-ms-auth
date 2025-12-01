import { NextFunction, Request, Response } from 'express'
import { ChangePasswordUseCase } from '../../application/useCases/ChangePasswordUseCase'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'

export class ChangePasswordHTTPController {
  static create = () => {
    return new ChangePasswordHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { oldPassword, newPassword } = req.body
      const accessToken = getAccessTokenFromHeaders(req) || ''

      await ChangePasswordUseCase.create().execute({
        accessToken,
        oldPassword,
        newPassword,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${ChangePasswordHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.CHANGE_PASSWORD,
        status,
      })
      next(authError)
    }
  }
}
