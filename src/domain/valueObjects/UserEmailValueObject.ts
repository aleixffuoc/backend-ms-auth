import { AuthError, ErrorType } from '../../errors/AuthError'
import { ValidateField } from '../../shared/utils/ValidateField'

export class UserEmailValueObject {
  #value

  constructor({ email }: { email: string }) {
    this.#value = email
  }

  static create = ({ email }: { email: string }) => {
    this.validate({ email })

    return new UserEmailValueObject({ email })
  }

  static validate = ({ email }: { email: string }) => {
    if (!email) {
      throw new AuthError({
        message: `[${UserEmailValueObject.name}#validate] Email is required`,
        type: ErrorType.INVALID_EMAIL,
        status: 400,
      })
    }

    if (typeof email !== 'string') {
      throw new AuthError({
        message: `[${UserEmailValueObject.name}#validate] Email must be a string`,
        type: ErrorType.INVALID_EMAIL,
        status: 400,
      })
    }

    const isValidEmail = ValidateField.isValidEmail(email)

    if (!isValidEmail) {
      throw new AuthError({
        message: `[${UserEmailValueObject.name}#validate] Invalid email format`,
        type: ErrorType.INVALID_EMAIL,
        status: 400,
      })
    }
  }

  get value() {
    return this.#value
  }
}
