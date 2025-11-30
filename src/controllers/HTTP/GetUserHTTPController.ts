import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { GetUserUseCase } from '../../application/useCases/GetUserUseCase'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'

export class GetUserHTTPController {
  constructor() {}

  static create = () => {
    return new GetUserHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const accessToken = getAccessTokenFromHeaders(req) || ''
      const response = await GetUserUseCase.create({ req }).execute({ accessToken })

      res.status(200).json(response)
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({ message: `[${GetUserHTTPController.name}#execute] ${error.message}`, type: ErrorType.GET_USER, status })
      next(authError)
    }
  }
}
