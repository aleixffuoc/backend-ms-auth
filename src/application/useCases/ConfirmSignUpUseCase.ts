import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'
import { Request } from 'express'

export class ConfirmSignUpUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create({ req }: { req: Request }) {
    return new ConfirmSignUpUseCase({
      authRepository: AWSAmplifyAuthRepository.create({ req }),
    })
  }

  async execute(params: { username: string; confirmationCode: string }) {
    await this.#authRepository.confirmSignUp(params)
  }
}
