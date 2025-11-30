import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'
import { Request } from 'express'

export class GetUserAdminUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create({ req }: { req: Request }) {
    return new GetUserAdminUseCase({
      authRepository: AWSAmplifyAuthRepository.create({ req }),
    })
  }

  async execute(params: { username: string }) {
    return this.#authRepository.getUserAdmin(params)
  }
}
