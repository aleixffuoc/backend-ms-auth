import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'

export class LoginUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create() {
    return new LoginUseCase({
      authRepository: AWSAmplifyAuthRepository.create(),
    })
  }

  async execute(params: { username: string; email: string; password: string }) {
    return this.#authRepository.login(params)
  }
}
