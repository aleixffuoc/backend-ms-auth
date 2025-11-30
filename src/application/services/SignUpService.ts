import { Request } from 'express'
import { SignUpUseCase } from '../useCases/SignUpUseCase'
import { GetUsersListUseCase } from '../useCases/GetUsersListUseCase'
import { AuthError, ErrorType } from '../../errors/AuthError'
import { DeleteUserAdminUseCase } from '../useCases/DeleteUserAdminUseCase'
import { UsernameValueObject } from '../../domain/valueObjects/UsernameValueObject'
import { UserEmailValueObject } from '../../domain/valueObjects/UserEmailValueObject'
import { UserPasswordValueObject } from '../../domain/valueObjects/UserPasswordValueObject'

export class SignUpService {
  #getUsersListUserCase
  #deleteUserAdminUseCase
  #signUpUseCase

  constructor(params: { getUsersListUserCase: GetUsersListUseCase; deleteUserAdminUseCase: DeleteUserAdminUseCase; signUpUseCase: SignUpUseCase }) {
    this.#getUsersListUserCase = params.getUsersListUserCase
    this.#deleteUserAdminUseCase = params.deleteUserAdminUseCase
    this.#signUpUseCase = params.signUpUseCase
  }

  static create({ req }: { req: Request }) {
    const getUsersListUserCase = GetUsersListUseCase.create({ req })
    const deleteUserAdminUseCase = DeleteUserAdminUseCase.create({ req })
    const signUpUseCase = SignUpUseCase.create({ req })

    return new SignUpService({ getUsersListUserCase, deleteUserAdminUseCase, signUpUseCase })
  }

  async execute({ username, email, password }: { username: UsernameValueObject; email: UserEmailValueObject; password: UserPasswordValueObject }) {
    const usersByUsernameReponse = await this.#getUsersListUserCase.execute({ username: username.value })
    const userByUsername = usersByUsernameReponse.users.find((user) => user.username === username.value)
    const isUserByUsernameConfirmed = userByUsername?.userStatus == 'CONFIRMED'

    if (isUserByUsernameConfirmed) {
      throw AuthError.create({
        message: `[${SignUpService.name}#execute] Username already exist`,
        type: ErrorType.GET_USERS_LIST,
        status: 409,
      })
    }

    const usersByEmailReponse = await this.#getUsersListUserCase.execute({ email: email.value })
    const userByEmail = usersByEmailReponse.users.find((user) => user.email === email.value)
    const isUserByEmailConfirmed = userByEmail?.userStatus == 'CONFIRMED'

    if (isUserByEmailConfirmed) {
      throw AuthError.create({
        message: `[${SignUpService.name}#execute] UserEmail already exist`,
        type: ErrorType.GET_USERS_LIST,
        status: 409,
      })
    }

    if (!userByEmail && !userByUsername) {
      return await this.#signUpUseCase.execute({
        email,
        username,
        password,
      })
    }

    //Delete befora sign up
    if (userByEmail?.username === userByUsername?.username) {
      await this.#deleteUserAdminUseCase.execute({ username: username.value })
    } else if (userByEmail && !isUserByEmailConfirmed) {
      await this.#deleteUserAdminUseCase.execute({ username: userByEmail.username })
    } else if (userByUsername && !isUserByUsernameConfirmed) {
      await this.#deleteUserAdminUseCase.execute({ username: userByUsername.username })
    }

    return await this.#signUpUseCase.execute({
      email,
      username,
      password,
    })
  }
}
