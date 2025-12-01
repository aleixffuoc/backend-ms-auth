import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'

export class LoginMFAUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create() {
    return new LoginMFAUseCase({
      authRepository: AWSAmplifyAuthRepository.create(),
    })
  }

  async execute(params: { username: string; email: string; sessionToken: string; code: string }) {
    return this.#authRepository.loginMFA(params)
  }
}
