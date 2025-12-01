import { EnableUserMFAUseCase } from '../useCases/EnableUserMFAUseCase'
import { GetUserUseCase } from '../useCases/GetUserUseCase'
import { VerifyMFACodeUseCase } from '../useCases/VerifyMFACodeUseCase'

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

  static create() {
    const verifyMFACodeUseCase = VerifyMFACodeUseCase.create()
    const enableMFAUseCase = EnableUserMFAUseCase.create()
    const getUserUseCase = GetUserUseCase.create()

    return new ActivateUserMFAService({ verifyMFACodeUseCase, enableMFAUseCase, getUserUseCase })
  }

  async execute({ accessToken, verifyCode }: { accessToken: string; verifyCode: string }) {
    await this.#verifyMFACodeUseCase.execute({ accessToken, verifyCode })
    await this.#enableMFAUseCase.execute({ accessToken })

    await this.#getUserUseCase.execute({ accessToken })
  }
}
