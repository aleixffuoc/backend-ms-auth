import { Request } from 'express'
import { publishMessage, EXCHANGES, ROUTINGKEYS } from '@anandasalut/be-message-bus'
import { DisableUserMFAUseCase } from '../useCases/DisableUserMFA'
import { GetUserUseCase } from '../useCases/GetUserUseCase'

export class DisableUserMFAService {
  #disableMFAUseCase
  #getUserUseCase

  constructor({ disableMFAUseCase, getUserUseCase }: { disableMFAUseCase: DisableUserMFAUseCase; getUserUseCase: GetUserUseCase }) {
    this.#disableMFAUseCase = disableMFAUseCase
    this.#getUserUseCase = getUserUseCase
  }

  static create({ req }: { req: Request }) {
    const disableMFAUseCase = DisableUserMFAUseCase.create({ req })
    const getUserUseCase = GetUserUseCase.create({ req })

    return new DisableUserMFAService({ disableMFAUseCase, getUserUseCase })
  }

  async execute({ accessToken }: { accessToken: string }) {
    await this.#disableMFAUseCase.execute({ accessToken })

    const user = await this.#getUserUseCase.execute({ accessToken })

    publishMessage({
      exchange: EXCHANGES.AUTH,
      routingKey: ROUTINGKEYS.AUTH_USER_MFA_DISABLED,
      message: {
        type: ROUTINGKEYS.AUTH_USER_MFA_DISABLED,
        userId: user.userId,
      },
    })
  }
}
