import { Request, Response, NextFunction } from 'express'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { getErrorStatusByName } from '../errors/errorStatus'
import { ResendSignUpUseCase } from '../../application/useCases/ResendSignUpCodeUseCase'

export class ResendSignUpCodeHTTPController {
  constructor() {}

  static create = () => {
    return new ResendSignUpCodeHTTPController()
  }

  async execute({ req, res, next }: { req: Request; res: Response; next: NextFunction }) {
    try {
      const { username } = req.body
      await ResendSignUpUseCase.create({ req }).execute({
        username,
      })

      res.status(200).json({})
    } catch (error: any) {
      if (error instanceof AuthError) {
        next(error)
        return
      }

      const status = getErrorStatusByName(error.name)
      const authError = new AuthError({
        message: `[${ResendSignUpCodeHTTPController.name}#execute] ${error.message}`,
        type: ErrorType.RESEND_SIGN_UP_CODE,
        status,
      })
      next(authError)
    }
  }
}
