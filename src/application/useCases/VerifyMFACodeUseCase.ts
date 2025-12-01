import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'

export class VerifyMFACodeUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create() {
    return new VerifyMFACodeUseCase({
      authRepository: AWSAmplifyAuthRepository.create(),
    })
  }

  async execute(params: { accessToken: string; verifyCode: string }) {
    return this.#authRepository.verifyMFACode(params)
  }
}
