export interface AuthRepository {
  verifyAccessToken: (params: verifyAccessTokenParams) => Promise<void>
  signUp: (params: SignUpParams) => Promise<SignUpResponse>
  resendSignUpCode: (params: ResendSignUpCodeParams) => Promise<void>
  confirmSignUp: (params: ConfirmSignUpParams) => Promise<void>
  login: (params: LoginParams) => Promise<LoginResponse | LoginMFAResponse>
  loginMFA: (params: LoginMFAParams) => Promise<Omit<LoginResponse, 'isMFAEnabled'>>
  generateMFACode: (params: GenerateMFACodeParams) => Promise<GenerateMFACodeResponse>
  verifyMFACode: (params: VerifyMFACodeParams) => Promise<void>
  enableUserMFA: (params: EnableUserMFAParams) => Promise<void>
  disableUserMFA: (params: DisableUserMFAParams) => Promise<void>
  getUsersList: (params: GetUsersListParams) => Promise<{ users: [] } | GetUsersListResponse>
  getUser: (params: GetUserParams) => Promise<GetUserResponse>
  getUserAdmin: (params: GetUserAdminParams) => Promise<GetUserAdminResponse>
  refreshToken: (params: RefreshTokenParams) => Promise<RefreshTokenResponse>
  changePassword: (params: ChangePasswordParams) => Promise<void>
  forgotPassword: (params: ForgotPasswordParams) => Promise<void>
  confirmForgotPassword: (params: ConfirmForgotPasswordParams) => Promise<void>
  deleteUser: (params: DeleteUserParams) => Promise<void>
  deleteUserAdmin: (params: DeleteUserAdminParams) => Promise<void>
}

// Authenticate interfaces
export interface verifyAccessTokenParams {
  accessToken: string
}

// SignUp interfaces
export interface SignUpParams {
  email: string
  username: string
  password: string
}
interface SignUpResponse {
  userId: string
}

// Confirm SignUp interfaces
export interface ConfirmSignUpParams {
  username: string
  confirmationCode: string
}

// Resend confirmation SignUp interfaces
export interface ResendSignUpCodeParams {
  username: string
}

// Refresh Token interfaces
export interface RefreshTokenParams {
  username: string
  refreshToken: string
}
export interface RefreshTokenResponse {
  accessToken: string
}

// Login interfaces
export interface LoginParams {
  username: string
  email: string
  password: string
}
export interface LoginCommonResponse {
  isMFAEnabled: boolean
}
export interface LoginResponse extends LoginCommonResponse {
  accessToken: string
  refreshToken: string
}
export interface LoginMFAResponse extends LoginCommonResponse {
  MFASessionToken: string
}

// Login MFA interfaces
export interface LoginMFAParams {
  username: string
  email: string
  sessionToken: string
  code: string
}

// Generate MFA interfaces
export interface GenerateMFACodeParams {
  accessToken: string
}
export interface GenerateMFACodeResponse {
  secretCode: string
}

// Verify MFA interfaces
export interface VerifyMFACodeParams {
  accessToken: string
  verifyCode: string
}

// Enable User MFA interfaces
export interface EnableUserMFAParams {
  accessToken: string
}

// Disable User MFA interfaces
export interface DisableUserMFAParams {
  accessToken: string
}

// Get List Users interfaces
interface GetUsersListByUsername {
  username: string
  email?: never
}

interface GetUsersListByEmail {
  email: string
  username?: never
}

export type GetUsersListParams = GetUsersListByUsername | GetUsersListByEmail

export interface GetUsersListResponse {
  users: {
    email: string
    username: string
    userId: string
    userStatus: 'CONFIRMED' | 'UNCONFIRMED'
  }[]
}

// Get User Admin interfaces
export interface GetUserAdminParams {
  username: string
}
export interface GetUserAdminResponse extends GetUserResponse {}

// Get User interfaces
export interface GetUserParams {
  accessToken: string
}
export interface GetUserResponse {
  email: string
  username: string
  userId: string
  isMFAEnabled: boolean
}

// Change password interfaces
export interface ChangePasswordParams {
  accessToken: string
  oldPassword: string
  newPassword: string
}

//Forgot Password interfaces
export interface ForgotPasswordParams {
  username: string
}

//Confirm Forgot Password interfaces
export interface ConfirmForgotPasswordParams {
  username: string
  confirmationCode: string
  password: string
}

//Delete User interfaces
export interface DeleteUserParams {
  accessToken: string
}

//Delete User Admin interfaces
export interface DeleteUserAdminParams {
  username: string
}
