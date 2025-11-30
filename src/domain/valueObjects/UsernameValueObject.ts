import { AuthError, ErrorType } from '../../errors/AuthError'

const MIN_USERNAME_LENGTH = 2
const MAX_USERNAME_LENGTH = 20

export class UsernameValueObject {
  #value

  constructor({ username }: { username: string }) {
    this.#value = username
  }

  static create = ({ username }: { username: string }) => {
    this.validate({ username })

    return new UsernameValueObject({ username })
  }

  static isValidUsername = ({ username }: { username: string }) => {
    return username.length > MIN_USERNAME_LENGTH && username.length <= MAX_USERNAME_LENGTH
  }

  static validate = ({ username }: { username: string }) => {
    if (!username) {
      throw new AuthError({
        message: `[${UsernameValueObject.name}#validate] Username is required`,
        type: ErrorType.INVALID_USERNAME,
        status: 400,
      })
    }

    if (typeof username !== 'string') {
      throw new AuthError({
        message: `[${UsernameValueObject.name}#validate] Username must be a string`,
        type: ErrorType.INVALID_USERNAME,
        status: 400,
      })
    }

    if (!this.isValidUsername({ username })) {
      throw new AuthError({
        message: `[${UsernameValueObject.name}#validate] Invalid username`,
        type: ErrorType.INVALID_USERNAME,
        status: 400,
      })
    }
  }

  get value() {
    return this.#value
  }
}
