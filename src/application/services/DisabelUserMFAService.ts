import { DisableUserMFAUseCase } from '../useCases/DisableUserMFA'
import { GetUserUseCase } from '../useCases/GetUserUseCase'

export class DisableUserMFAService {
  #disableMFAUseCase
  #getUserUseCase

  constructor({ disableMFAUseCase, getUserUseCase }: { disableMFAUseCase: DisableUserMFAUseCase; getUserUseCase: GetUserUseCase }) {
    this.#disableMFAUseCase = disableMFAUseCase
    this.#getUserUseCase = getUserUseCase
  }

  static create() {
    const disableMFAUseCase = DisableUserMFAUseCase.create()
    const getUserUseCase = GetUserUseCase.create()

    return new DisableUserMFAService({ disableMFAUseCase, getUserUseCase })
  }

  async execute({ accessToken }: { accessToken: string }) {
    await this.#disableMFAUseCase.execute({ accessToken })

    await this.#getUserUseCase.execute({ accessToken })
  }
}
