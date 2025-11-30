import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'
import { VerifyAccessTokenService } from '../../application/services/VerifyAccessTokenService'

export class VerifyAccessTokenHTTPController {
  static create = () => {
    return new VerifyAccessTokenHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { userId } = req.body
      const accessToken = getAccessTokenFromHeaders(req) || ''

      await VerifyAccessTokenService.create({ req }).execute({
        accessToken,
        userId,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      let status = getErrorStatusByName(error)
      if (status === 500) {
        status = getErrorStatusByName(error.constructor?.name)
      }
      const authError = new AuthError({
        message: `[${VerifyAccessTokenHTTPController.name}#execute]' ${error.message}`,
        type: ErrorType.VERIFY_ACCESS_TOKEN,
        status,
      })
      next(authError)
    }
  }
}
