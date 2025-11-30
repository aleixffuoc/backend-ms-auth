import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'
import { Request } from 'express'

export class DeleteUserAdminUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create({ req }: { req: Request }) {
    return new DeleteUserAdminUseCase({
      authRepository: AWSAmplifyAuthRepository.create({ req }),
    })
  }

  async execute(params: { username: string }) {
    return await this.#authRepository.deleteUserAdmin({ username: params.username })
  }
}
