import { NextFunction, Request, Response } from 'express'
import { GenerateTOTPQRService } from '../../application/services/GenerateTOTPQRService'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'

export class GenerateTOTPQRHTTPController {
  static create = () => {
    return new GenerateTOTPQRHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { TOTPName } = req.body
      const accessToken = getAccessTokenFromHeaders(req) || ''

      const response = await GenerateTOTPQRService.create().execute({ accessToken, TOTPName })

      res.status(200).json({ QRImage: response })
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${GenerateTOTPQRHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.GENERATE_TOTP_QR,
        status,
      })
      next(authError)
    }
  }
}
