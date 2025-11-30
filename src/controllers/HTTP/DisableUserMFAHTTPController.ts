import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'
import { DisableUserMFAService } from '../../application/services/DisabelUserMFAService'

export class DisableUserMFAHTTPController {
  static create = () => {
    return new DisableUserMFAHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const accessToken = getAccessTokenFromHeaders(req) || ''
      await DisableUserMFAService.create({ req }).execute({
        accessToken,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${DisableUserMFAHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.ENABLE_USER_MFA,
        status,
      })
      next(authError)
    }
  }
}
