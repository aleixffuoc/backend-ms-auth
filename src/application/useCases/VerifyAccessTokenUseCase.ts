import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'

export class VerifyAccessTokenUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create() {
    return new VerifyAccessTokenUseCase({
      authRepository: AWSAmplifyAuthRepository.create(),
    })
  }

  async execute(params: { accessToken: string }) {
    return this.#authRepository.verifyAccessToken(params)
  }
}
