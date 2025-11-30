import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'
import { Request } from 'express'

export class DisableUserMFAUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create({ req }: { req: Request }) {
    return new DisableUserMFAUseCase({
      authRepository: AWSAmplifyAuthRepository.create({ req }),
    })
  }

  async execute({ accessToken }: { accessToken: string }) {
    await this.#authRepository.disableUserMFA({ accessToken })
  }
}
