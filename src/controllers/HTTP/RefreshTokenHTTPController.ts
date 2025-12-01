import { NextFunction, Request, Response } from 'express'
import { RefreshTokenService } from '../../application/services/RefreshTokenService'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'

export class RefreshTokenHTTPController {
  #refreshTokenService

  constructor({ refreshTokenService }: { refreshTokenService: RefreshTokenService }) {
    this.#refreshTokenService = refreshTokenService
  }

  static create = () => {
    const refreshTokenService = RefreshTokenService.create()
    return new RefreshTokenHTTPController({ refreshTokenService })
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { refreshToken } = req.body
      const accessToken = getAccessTokenFromHeaders(req) || ''

      const response = await this.#refreshTokenService.execute({
        refreshToken,
        accessToken,
      })

      res.status(200).json(response)
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${RefreshTokenHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.REFRESH_TOKEN,
        status,
      })
      next(authError)
    }
  }
}
