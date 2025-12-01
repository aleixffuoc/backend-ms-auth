import { NextFunction, Request, Response } from 'express'
import { ActivateUserMFAService } from '../../application/services/ActivateUserMFAService'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'

export class ActivateUserMFAHTTPController {
  static create = () => {
    return new ActivateUserMFAHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { verifyCode } = req.body
      const accessToken = getAccessTokenFromHeaders(req) || ''

      await ActivateUserMFAService.create().execute({
        accessToken,
        verifyCode,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${ActivateUserMFAHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.ACTIVATE_USER_MFA,
        status,
      })
      next(authError)
    }
  }
}
