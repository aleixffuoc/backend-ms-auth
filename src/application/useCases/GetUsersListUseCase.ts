import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'

interface GetUsersListExecuteByUsernameUseCaseParams {
  username: string
  email?: never
}

interface GetUsersListExecuteByEmailUseCaseParams {
  email: string
  username?: never
}

export type GetUsersListExecutelUseCaseParams = GetUsersListExecuteByUsernameUseCaseParams | GetUsersListExecuteByEmailUseCaseParams

export class GetUsersListUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create() {
    return new GetUsersListUseCase({
      authRepository: AWSAmplifyAuthRepository.create(),
    })
  }

  async execute({ username, email }: GetUsersListExecutelUseCaseParams) {
    if (username) {
      return this.#authRepository.getUsersList({ username })
    }

    if (email) {
      return this.#authRepository.getUsersList({ email })
    }

    throw AuthError.create({
      message: `[${GetUsersListUseCase.name}#execute] Invalid parameters`,
      type: ErrorType.GET_USERS_LIST,
      status: 400,
    })
  }
}
