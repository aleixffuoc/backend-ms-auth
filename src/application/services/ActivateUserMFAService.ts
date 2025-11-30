import { Request } from 'express'
import { VerifyMFACodeUseCase } from '../useCases/VerifyMFACodeUseCase'
import { EnableUserMFAUseCase } from '../useCases/EnableUserMFAUseCase'
import { GetUserUseCase } from '../useCases/GetUserUseCase'
import { publishMessage, EXCHANGES, ROUTINGKEYS } from '@anandasalut/be-message-bus'

export class ActivateUserMFAService {
  #verifyMFACodeUseCase
  #enableMFAUseCase
  #getUserUseCase

  constructor({
    verifyMFACodeUseCase,
    enableMFAUseCase,
    getUserUseCase,
  }: {
    verifyMFACodeUseCase: VerifyMFACodeUseCase
    enableMFAUseCase: EnableUserMFAUseCase
    getUserUseCase: GetUserUseCase
  }) {
    this.#verifyMFACodeUseCase = verifyMFACodeUseCase
    this.#enableMFAUseCase = enableMFAUseCase
    this.#getUserUseCase = getUserUseCase
  }

  static create({ req }: { req: Request }) {
    const verifyMFACodeUseCase = VerifyMFACodeUseCase.create({ req })
    const enableMFAUseCase = EnableUserMFAUseCase.create({ req })
    const getUserUseCase = GetUserUseCase.create({ req })

    return new ActivateUserMFAService({ verifyMFACodeUseCase, enableMFAUseCase, getUserUseCase })
  }

  async execute({ accessToken, verifyCode }: { accessToken: string; verifyCode: string }) {
    await this.#verifyMFACodeUseCase.execute({ accessToken, verifyCode })
    await this.#enableMFAUseCase.execute({ accessToken })

    const user = await this.#getUserUseCase.execute({ accessToken })

    publishMessage({
      exchange: EXCHANGES.AUTH,
      routingKey: ROUTINGKEYS.AUTH_USER_MFA_ENABLED,
      message: {
        type: ROUTINGKEYS.AUTH_USER_MFA_ENABLED,
        userId: user.userId,
      },
    })
  }
}
