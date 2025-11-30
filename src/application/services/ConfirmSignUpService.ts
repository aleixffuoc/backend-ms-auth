import { Request } from 'express'
import { UsernameValueObject } from '../../domain/valueObjects/UsernameValueObject'
import { ConfirmSignUpUseCase } from '../useCases/ConfirmSignUpUseCase'
import { GetUserAdminUseCase } from '../useCases/GetUserAdminUseCase'
import { publishMessage, EXCHANGES, ROUTINGKEYS } from '@anandasalut/be-message-bus'

export class ConfirmSignUpService {
  #confirmSignUpUseCase
  #getUserAdminUseCase

  constructor(params: { confirmSignUpUseCase: ConfirmSignUpUseCase; getUserAdminUseCase: GetUserAdminUseCase }) {
    this.#confirmSignUpUseCase = params.confirmSignUpUseCase
    this.#getUserAdminUseCase = params.getUserAdminUseCase
  }

  static create({ req }: { req: Request }) {
    const confirmSignUpUseCase = ConfirmSignUpUseCase.create({ req })
    const getUserAdminUseCase = GetUserAdminUseCase.create({ req })

    return new ConfirmSignUpService({ confirmSignUpUseCase, getUserAdminUseCase })
  }

  async execute(params: { username: UsernameValueObject; confirmationCode: string }) {
    const { username, confirmationCode } = params

    await this.#confirmSignUpUseCase.execute({ username: username.value, confirmationCode: confirmationCode })

    const userResponse = await this.#getUserAdminUseCase.execute({ username: username.value })

    publishMessage({
      exchange: EXCHANGES.AUTH,
      routingKey: ROUTINGKEYS.AUTH_USER_CONFIRMED,
      message: {
        type: ROUTINGKEYS.AUTH_USER_CONFIRMED,
        userId: userResponse.userId,
      },
    })
  }
}
