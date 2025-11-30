export const getErrorStatusByName = (name: string) => {
  switch (name) {
    case 'InvalidParameterException':
    case 'InvalidPasswordException':
    case 'EnableSoftwareTokenMFAException':
    case 'CodeMismatchException':
    case 'ExpiredCodeException':
      return 400
    case 'NotAuthorizedException':
    case 'JwtExpiredError':
      return 401
    case 'UnrecognizedClientException':
      return 403
    case 'UserNotFoundException':
      return 404
    case 'UsernameExistsException':
    case 'UserNotConfirmedException':
      return 409
    default:
      return 500
  }
}
