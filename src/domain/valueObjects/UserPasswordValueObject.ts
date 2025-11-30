import { AuthError, ErrorType } from '../../errors/AuthError'

export class UserPasswordValueObject {
  #value

  constructor({ password }: { password: string }) {
    this.#value = password
  }

  static create = ({ password }: { password: string }) => {
    this.validate({ password })

    return new UserPasswordValueObject({ password })
  }

  static isValidPassword = ({ password }: { password: string }) => {
    // Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  static validate = ({ password }: { password: string }) => {
    if (!password) {
      throw new AuthError({
        message: `[${UserPasswordValueObject.name}#validate] Password is required`,
        type: ErrorType.INVALID_PASSWORD,
        status: 400,
      })
    }

    if (typeof password !== 'string') {
      throw new AuthError({
        message: `[${UserPasswordValueObject.name}#validate] Password must be a string`,
        type: ErrorType.INVALID_PASSWORD,
        status: 400,
      })
    }

    if (!this.isValidPassword({ password })) {
      throw new AuthError({
        message: `[${UserPasswordValueObject.name}#validate] Invalid password`,
        type: ErrorType.INVALID_PASSWORD,
        status: 400,
      })
    }
  }

  get value() {
    return this.#value
  }
}
