import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'
import { Request } from 'express'

export class VerifyMFACodeUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create({ req }: { req: Request }) {
    return new VerifyMFACodeUseCase({
      authRepository: AWSAmplifyAuthRepository.create({ req }),
    })
  }

  async execute(params: { accessToken: string; verifyCode: string }) {
    return this.#authRepository.verifyMFACode(params)
  }
}
