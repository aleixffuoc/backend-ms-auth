import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'

export class DisableUserMFAUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create() {
    return new DisableUserMFAUseCase({
      authRepository: AWSAmplifyAuthRepository.create(),
    })
  }

  async execute({ accessToken }: { accessToken: string }) {
    await this.#authRepository.disableUserMFA({ accessToken })
  }
}
