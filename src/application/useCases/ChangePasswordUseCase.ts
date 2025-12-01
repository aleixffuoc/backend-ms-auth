import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'

export class ChangePasswordUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create() {
    return new ChangePasswordUseCase({
      authRepository: AWSAmplifyAuthRepository.create(),
    })
  }

  async execute(params: { accessToken: string; oldPassword: string; newPassword: string }) {
    return this.#authRepository.changePassword(params)
  }
}
