import validator from 'validator'

export class ValidateField {
  static isValidEmail(email: string): boolean {
    return validator.isEmail(email)
  }

  static isValidMobilePhoneNumber(phone: string) {
    return validator.isMobilePhone(phone)
  }
}
