import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { getAccessTokenFromHeaders } from '../helpers/getAccessTokenFromHeaders'
import { DeleteUserUseCase } from '../../application/useCases/DeleteUserUseCase'

export class DeleteUserHTTPController {
  static create = () => {
    return new DeleteUserHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const accessToken = getAccessTokenFromHeaders(req) || ''
      await DeleteUserUseCase.create({ req }).execute({
        accessToken,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({ message: `[${DeleteUserHTTPController.name}#execute] ${error.message}`, type: ErrorType.DELETE_USER, status })
      next(authError)
    }
  }
}
