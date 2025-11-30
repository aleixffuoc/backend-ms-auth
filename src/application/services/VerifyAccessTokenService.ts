import { GetUserUseCase } from '../useCases/GetUserUseCase'
import { Request } from 'express'
import { VerifyAccessTokenUseCase } from '../useCases/VerifyAccessTokenUseCase'
import { AuthError, ErrorType } from '../../errors/AuthError'

export class VerifyAccessTokenService {
  #verifyAccessTokenUseCase
  #getUserUserCase

  constructor({
    getUserUserCase,
    verifyAccessTokenUseCase,
  }: {
    verifyAccessTokenUseCase: VerifyAccessTokenUseCase
    getUserUserCase: GetUserUseCase
  }) {
    this.#getUserUserCase = getUserUserCase
    this.#verifyAccessTokenUseCase = verifyAccessTokenUseCase
  }

  static create({ req }: { req: Request }) {
    const verifyAccessTokenUseCase = VerifyAccessTokenUseCase.create({ req })
    const getUserUserCase = GetUserUseCase.create({ req })

    return new VerifyAccessTokenService({ getUserUserCase, verifyAccessTokenUseCase })
  }

  async execute({ accessToken, userId }: { accessToken: string; userId: string }) {
    await this.#verifyAccessTokenUseCase.execute({ accessToken })

    const userReponse = await this.#getUserUserCase.execute({ accessToken })
    const { userId: accessTokenUserId } = userReponse

    if (accessTokenUserId !== userId) {
      throw AuthError.create({
        message: `[${VerifyAccessTokenService.name}#execute] userId does not match`,
        type: ErrorType.VERIFY_ACCESS_TOKEN,
        status: 401,
      })
    }
  }
}
