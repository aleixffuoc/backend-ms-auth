import { Request } from 'express'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { AuthError, ErrorType } from '../errors/AuthError'
import {
  AuthRepository,
  ChangePasswordParams,
  ConfirmForgotPasswordParams,
  ConfirmSignUpParams,
  DeleteUserAdminParams,
  DeleteUserParams,
  EnableUserMFAParams,
  ForgotPasswordParams,
  GenerateMFACodeParams,
  GetUserAdminParams,
  GetUserParams,
  GetUsersListParams,
  LoginMFAParams,
  LoginParams,
  RefreshTokenParams,
  ResendSignUpCodeParams,
  SignUpParams,
  verifyAccessTokenParams,
  VerifyMFACodeParams,
} from '../domain/interfaces/repositories/AuthRepository'
import {
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AssociateSoftwareTokenCommand,
  AuthFlowType,
  ChallengeNameType,
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  DeleteUserCommand,
  ForgotPasswordCommand,
  GetUserCommand,
  InitiateAuthCommand,
  ListUsersCommand,
  ResendConfirmationCodeCommand,
  RespondToAuthChallengeCommand,
  SetUserMFAPreferenceCommand,
  SignUpCommand,
  VerifySoftwareTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { getAWSClientSecretFromHeaders } from './helpers/getAWSClientSecretFromHeaders'
import { generateSecretHash } from './helpers/generateSecretHash'

export class AWSAmplifyAuthRepository implements AuthRepository {
  #cognitoSession
  #clientSecret
  #clientId
  #userPoolId

  constructor({ cognitoSession, clientSecret }: { cognitoSession: CognitoIdentityProviderClient; clientSecret: string }) {
    this.#cognitoSession = cognitoSession
    this.#clientSecret = clientSecret
    this.#clientId = process.env.AWS_USER_POOL_CLIENT_ID || ''
    this.#userPoolId = process.env.AWS_USER_POOL_ID || ''
  }

  static create({ req }: { req: Request }) {
    const cognitoSession = new CognitoIdentityProviderClient({
      region: process.env.AWS_USER_REGION,
      credentials: {
        accessKeyId: process.env.AWS_USER_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_USER_ACCESS_SECRET_KEY || '',
      },
    })
    const clientSecret = getAWSClientSecretFromHeaders(req) || ''

    return new AWSAmplifyAuthRepository({ cognitoSession, clientSecret })
  }

  async verifyAccessToken({ accessToken }: verifyAccessTokenParams) {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.AWS_USER_POOL_ID || '',
      tokenUse: 'access',
      clientId: this.#clientId,
    })

    await verifier.verify(accessToken)
  }

  async signUp({ email, username, password }: SignUpParams) {
    const signUp = new SignUpCommand({
      ClientId: this.#clientId,
      Username: username,
      Password: password,
      SecretHash: generateSecretHash({ clientId: this.#clientId, clientSecret: this.#clientSecret, username: username }),
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    })

    const response = await this.#cognitoSession.send(signUp)

    const { UserSub } = response

    if (!UserSub) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#signUp] UserSub is empty`, type: ErrorType.SIGN_UP, status: 400 })
    }

    return { userId: UserSub }
  }

  async resendSignUpCode({ username }: ResendSignUpCodeParams) {
    const resendSignUpCode = new ResendConfirmationCodeCommand({
      ClientId: this.#clientId,
      Username: username,
      SecretHash: generateSecretHash({ clientId: this.#clientId, clientSecret: this.#clientSecret, username: username }),
    })

    await this.#cognitoSession.send(resendSignUpCode)
  }

  async confirmSignUp({ username, confirmationCode }: ConfirmSignUpParams) {
    const confirmSignUp = new ConfirmSignUpCommand({
      ClientId: this.#clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      SecretHash: generateSecretHash({ clientId: this.#clientId, clientSecret: this.#clientSecret, username: username }),
    })

    await this.#cognitoSession.send(confirmSignUp)
  }

  async login({ username, email, password }: LoginParams) {
    const login = new InitiateAuthCommand({
      ClientId: this.#clientId,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: username || email,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash({ clientId: this.#clientId, clientSecret: this.#clientSecret, username: username || email }),
      },
    })

    const response = await this.#cognitoSession.send(login)

    const { ChallengeName } = response

    if (ChallengeName === ChallengeNameType.SOFTWARE_TOKEN_MFA) {
      const { Session } = response

      if (!Session) {
        throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#login] Session for MFA is empty`, type: ErrorType.LOGIN, status: 400 })
      }

      return { isMFAEnabled: true, MFASessionToken: Session }
    }

    if (!response.AuthenticationResult) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#login] AuthenticationResult is empty`, type: ErrorType.LOGIN, status: 400 })
    }

    const { AccessToken, RefreshToken } = response.AuthenticationResult

    if (!AccessToken || !RefreshToken) {
      throw new AuthError({
        message: `[${AWSAmplifyAuthRepository.name}#login] AccesToken: ${AccessToken} - RefreshToken: ${RefreshToken} someone is empty`,
        type: ErrorType.LOGIN,
        status: 400,
      })
    }

    return { isMFAEnabled: false, accessToken: AccessToken, refreshToken: RefreshToken }
  }

  async generateMFACode({ accessToken }: GenerateMFACodeParams) {
    const generateMFACode = new AssociateSoftwareTokenCommand({
      AccessToken: accessToken,
    })

    const response = await this.#cognitoSession.send(generateMFACode)

    if (!response.SecretCode) {
      throw new AuthError({
        message: `[${AWSAmplifyAuthRepository.name}#generateMFACode] SecretCode is empty`,
        type: ErrorType.GENERATE_MFA,
        status: 400,
      })
    }

    const { SecretCode } = response

    return { secretCode: SecretCode }
  }

  async verifyMFACode({ accessToken, verifyCode }: VerifyMFACodeParams) {
    const verifyMFACode = new VerifySoftwareTokenCommand({
      AccessToken: accessToken,
      UserCode: verifyCode,
    })

    await this.#cognitoSession.send(verifyMFACode)
  }

  async enableUserMFA({ accessToken }: EnableUserMFAParams) {
    const enableUserMFA = new SetUserMFAPreferenceCommand({
      AccessToken: accessToken,
      SoftwareTokenMfaSettings: {
        Enabled: true,
        PreferredMfa: true,
      },
    })

    await this.#cognitoSession.send(enableUserMFA)
  }

  async disableUserMFA({ accessToken }: EnableUserMFAParams) {
    const disableUserMFA = new SetUserMFAPreferenceCommand({
      AccessToken: accessToken,
      SoftwareTokenMfaSettings: {
        Enabled: false,
        PreferredMfa: false,
      },
    })

    await this.#cognitoSession.send(disableUserMFA)
  }

  async loginMFA({ username, email, sessionToken, code }: LoginMFAParams) {
    const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
      ClientId: this.#clientId,
      ChallengeName: ChallengeNameType.SOFTWARE_TOKEN_MFA,
      ChallengeResponses: {
        USERNAME: username || email,
        SOFTWARE_TOKEN_MFA_CODE: code,
        SECRET_HASH: generateSecretHash({ clientId: this.#clientId, clientSecret: this.#clientSecret, username: username || email }),
      },
      Session: sessionToken,
    })

    const response = await this.#cognitoSession.send(respondToAuthChallengeCommand)

    if (!response.AuthenticationResult) {
      throw new AuthError({
        message: `[${AWSAmplifyAuthRepository.name}#loginMFA] AuthenticationResult is empty`,
        type: ErrorType.LOGIN_MFA,
        status: 400,
      })
    }

    const { AccessToken, RefreshToken } = response.AuthenticationResult

    if (!AccessToken || !RefreshToken) {
      throw new AuthError({
        message: `[${AWSAmplifyAuthRepository.name}#loginMFA] AccesToken: ${AccessToken} - RefreshToken: ${RefreshToken} someone is empty`,
        type: ErrorType.LOGIN_MFA,
        status: 400,
      })
    }

    return { accessToken: AccessToken, refreshToken: RefreshToken }
  }

  async getUsersList({ username, email }: GetUsersListParams) {
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: this.#userPoolId,
      AttributesToGet: ['email', 'sub'],
      Filter: username ? `username = "${username}"` : `email = "${email}"`,
    })

    const response = await this.#cognitoSession.send(listUsersCommand)

    const users = response.Users

    if (!users) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUsersList] Users is empty`, type: ErrorType.GET_USERS_LIST, status: 400 })
    }

    if (users.length === 0) {
      return { users: [] }
    }

    const usersList = users.map((user) => {
      const username = user.Username

      if (!username) {
        throw new AuthError({
          message: `[${AWSAmplifyAuthRepository.name}#getUsersList] Username is empty`,
          type: ErrorType.GET_USERS_LIST,
          status: 400,
        })
      }

      const userAttributes = user.Attributes

      if (!userAttributes) {
        throw new AuthError({
          message: `[${AWSAmplifyAuthRepository.name}#getUsersList] Attributes is empty`,
          type: ErrorType.GET_USERS_LIST,
          status: 400,
        })
      }

      const email = userAttributes.find((attribute) => attribute.Name === 'email')?.Value
      const userId = userAttributes.find((attribute) => attribute.Name === 'sub')?.Value

      if (!email) {
        throw new AuthError({
          message: `[${AWSAmplifyAuthRepository.name}#getUsersList] Email is empty`,
          type: ErrorType.GET_USERS_LIST,
          status: 400,
        })
      }

      if (!userId) {
        throw new AuthError({
          message: `[${AWSAmplifyAuthRepository.name}#getUsersList] UserId is empty`,
          type: ErrorType.GET_USERS_LIST,
          status: 400,
        })
      }

      const userStatus = user.UserStatus as 'CONFIRMED' | 'UNCONFIRMED'

      if (!userStatus) {
        throw new AuthError({
          message: `[${AWSAmplifyAuthRepository.name}#getUsersList] UserStatus is empty`,
          type: ErrorType.GET_USERS_LIST,
          status: 400,
        })
      }

      return { username, email, userId, userStatus }
    })

    return { users: usersList }
  }

  async getUser({ accessToken }: GetUserParams) {
    const getUserCommand = new GetUserCommand({
      AccessToken: accessToken,
    })

    const response = await this.#cognitoSession.send(getUserCommand)

    const { UserMFASettingList } = response

    const isMFAEnabled = UserMFASettingList ? UserMFASettingList.includes(ChallengeNameType.SOFTWARE_TOKEN_MFA) : false

    const { Username } = response

    if (!Username) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUser] Username is empty`, type: ErrorType.GET_USER, status: 400 })
    }

    const { UserAttributes } = response

    if (!UserAttributes) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUser] UserAttributes is empty`, type: ErrorType.GET_USER, status: 400 })
    }

    const email = UserAttributes.find((attribute) => attribute.Name === 'email')?.Value
    const sub = UserAttributes.find((attribute) => attribute.Name === 'sub')?.Value

    if (!email) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUser] Email is empty`, type: ErrorType.GET_USER, status: 400 })
    }

    if (!sub) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUser] Sub is empty`, type: ErrorType.GET_USER, status: 400 })
    }

    return { username: Username, email, userId: sub, isMFAEnabled }
  }

  async getUserAdmin({ username }: GetUserAdminParams) {
    const getUserAdminCommand = new AdminGetUserCommand({
      Username: username,
      UserPoolId: this.#userPoolId,
    })

    const response = await this.#cognitoSession.send(getUserAdminCommand)

    const { UserMFASettingList } = response

    const isMFAEnabled = UserMFASettingList ? UserMFASettingList.includes(ChallengeNameType.SOFTWARE_TOKEN_MFA) : false

    const { Username } = response

    if (!Username) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUser] Username is empty`, type: ErrorType.GET_USER, status: 400 })
    }

    const { UserAttributes } = response

    if (!UserAttributes) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUser] UserAttributes is empty`, type: ErrorType.GET_USER, status: 400 })
    }

    const email = UserAttributes.find((attribute) => attribute.Name === 'email')?.Value
    const sub = UserAttributes.find((attribute) => attribute.Name === 'sub')?.Value

    if (!email) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUser] Email is empty`, type: ErrorType.GET_USER, status: 400 })
    }

    if (!sub) {
      throw new AuthError({ message: `[${AWSAmplifyAuthRepository.name}#getUser] Sub is empty`, type: ErrorType.GET_USER, status: 400 })
    }

    return { username: Username, email, userId: sub, isMFAEnabled }
  }

  async refreshToken({ username, refreshToken }: RefreshTokenParams) {
    const refreshTokenCommand = new InitiateAuthCommand({
      ClientId: this.#clientId,
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: generateSecretHash({ clientId: this.#clientId, clientSecret: this.#clientSecret, username }),
      },
    })

    const response = await this.#cognitoSession.send(refreshTokenCommand)

    if (!response.AuthenticationResult) {
      throw new AuthError({
        message: `[${AWSAmplifyAuthRepository.name}#refreshToken] AuthenticationResult is empty`,
        type: ErrorType.REFRESH_TOKEN,
        status: 400,
      })
    }

    const { AccessToken } = response.AuthenticationResult

    if (!AccessToken) {
      throw new AuthError({
        message: `[${AWSAmplifyAuthRepository.name}#refreshToken] AccessToken is empty`,
        type: ErrorType.REFRESH_TOKEN,
        status: 400,
      })
    }

    return { accessToken: AccessToken }
  }

  async changePassword({ accessToken, oldPassword, newPassword }: ChangePasswordParams) {
    const changePassword = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
    })

    await this.#cognitoSession.send(changePassword)
  }

  async forgotPassword({ username }: ForgotPasswordParams) {
    const forgotPassword = new ForgotPasswordCommand({
      ClientId: this.#clientId,
      Username: username,
      SecretHash: generateSecretHash({ clientId: this.#clientId, clientSecret: this.#clientSecret, username }),
    })

    await this.#cognitoSession.send(forgotPassword)
  }

  async confirmForgotPassword({ username, confirmationCode, password }: ConfirmForgotPasswordParams) {
    const confirmForgotPassword = new ConfirmForgotPasswordCommand({
      ClientId: this.#clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      Password: password,
      SecretHash: generateSecretHash({ clientId: this.#clientId, clientSecret: this.#clientSecret, username }),
    })

    await this.#cognitoSession.send(confirmForgotPassword)
  }

  async deleteUser({ accessToken }: DeleteUserParams) {
    const deleteUser = new DeleteUserCommand({
      AccessToken: accessToken,
    })

    await this.#cognitoSession.send(deleteUser)
  }

  async deleteUserAdmin({ username }: DeleteUserAdminParams) {
    const deleteUserAdmin = new AdminDeleteUserCommand({
      UserPoolId: this.#userPoolId,
      Username: username,
    })

    await this.#cognitoSession.send(deleteUserAdmin)
  }
}
