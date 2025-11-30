export enum ErrorType {
  ACTIVATE_USER_MFA = 'ACTIVATE_USER_MFA',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  CONFIRM_FORGOT_PASSWORD = 'CONFIRM_FORGOT_PASSWORD',
  CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP',
  DELETE_USER = 'DELETE_USER',
  DISABLE_USER_MFA = 'DISABLE_USER_MFA',
  ENABLE_USER_MFA = 'ENABLE_USER_MFA',
  FORGOT_PASSWORD = 'FORGOT_PASSWOD',
  GENERATE_MFA = 'GENERATE_MFA',
  GENERATE_QR_CODE = 'GENERATE_QR_CODE',
  GENERATE_TOTP_QR = 'GENERATE_TOTP_QR',
  GENERIC = 'GENERIC',
  GET_USER = 'GET_USER',
  GET_USERS_LIST = 'GET_USERS_LIST',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_USERNAME = 'INVALID_USERNAME',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  LOGIN = 'LOGIN',
  LOGIN_MFA = 'LOGIN_MFA',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  RESEND_SIGN_UP_CODE = 'RESEND_SIGN_UP_CODE',
  SIGN_UP = 'SIGN_UP',
  VERIFY_ACCESS_TOKEN = 'VERIFY_ACCESS_TOKEN',
  VERIFY_MFA_CODE = 'VERIFY_MFA_CODE',
}

const MS_ERROR_TYPE = 'AUTH'

type AuthUserErrorParams = { message: string; type: ErrorType; status: number }

export class AuthError extends Error {
  type
  status
  stack

  constructor({ message, type, status }: AuthUserErrorParams) {
    super(message)
    this.type = `${MS_ERROR_TYPE}_${type}`
    this.status = status
    this.stack = `message: ${message} - type: ${this.type} - ${new Date().toISOString()}`
  }

  static create = (params: AuthUserErrorParams) => new AuthError(params)
}
