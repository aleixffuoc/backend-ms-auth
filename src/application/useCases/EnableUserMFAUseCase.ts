import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'
import { Request } from 'express'

export class EnableUserMFAUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create({ req }: { req: Request }) {
    return new EnableUserMFAUseCase({
      authRepository: AWSAmplifyAuthRepository.create({ req }),
    })
  }

  async execute(params: { accessToken: string }) {
    return this.#authRepository.enableUserMFA(params)
  }
}
