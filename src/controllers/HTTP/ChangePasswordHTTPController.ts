import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { ChangePasswordUseCase } from '../../application/useCases/ChangePasswordUseCase'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'

export class ChangePasswordHTTPController {
  static create = () => {
    return new ChangePasswordHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { oldPassword, newPassword } = req.body
      const accessToken = getAccessTokenFromHeaders(req) || ''

      await ChangePasswordUseCase.create({ req }).execute({
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
