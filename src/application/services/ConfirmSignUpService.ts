import { UsernameValueObject } from '../../domain/valueObjects/UsernameValueObject'
import { ConfirmSignUpUseCase } from '../useCases/ConfirmSignUpUseCase'
import { GetUserAdminUseCase } from '../useCases/GetUserAdminUseCase'

export class ConfirmSignUpService {
  #confirmSignUpUseCase
  #getUserAdminUseCase

  constructor(params: { confirmSignUpUseCase: ConfirmSignUpUseCase; getUserAdminUseCase: GetUserAdminUseCase }) {
    this.#confirmSignUpUseCase = params.confirmSignUpUseCase
    this.#getUserAdminUseCase = params.getUserAdminUseCase
  }

  static create() {
    const confirmSignUpUseCase = ConfirmSignUpUseCase.create()
    const getUserAdminUseCase = GetUserAdminUseCase.create()

    return new ConfirmSignUpService({ confirmSignUpUseCase, getUserAdminUseCase })
  }

  async execute(params: { username: UsernameValueObject; confirmationCode: string }) {
    const { username, confirmationCode } = params

    await this.#confirmSignUpUseCase.execute({ username: username.value, confirmationCode: confirmationCode })

    await this.#getUserAdminUseCase.execute({ username: username.value })
  }
}
