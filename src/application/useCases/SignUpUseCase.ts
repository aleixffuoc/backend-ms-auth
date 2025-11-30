import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository'
import { UserEmailValueObject } from '../../domain/valueObjects/UserEmailValueObject'
import { UsernameValueObject } from '../../domain/valueObjects/UsernameValueObject'
import { UserPasswordValueObject } from '../../domain/valueObjects/UserPasswordValueObject'
import { AWSAmplifyAuthRepository } from '../../infrastructure/AWSCognitoRepository'
import { Request } from 'express'

interface SignUpUseCaseExecuteParams {
  password: UserPasswordValueObject
  username: UsernameValueObject
  email: UserEmailValueObject
}

export class SignUpUseCase {
  #authRepository

  constructor({ authRepository }: { authRepository: AuthRepository }) {
    this.#authRepository = authRepository
  }

  static create({ req }: { req: Request }) {
    return new SignUpUseCase({
      authRepository: AWSAmplifyAuthRepository.create({ req }),
    })
  }

  async execute(params: SignUpUseCaseExecuteParams) {
    return await this.#authRepository.signUp({
      email: params.email.value,
      username: params.username.value,
      password: params.password.value,
    })
  }
}
