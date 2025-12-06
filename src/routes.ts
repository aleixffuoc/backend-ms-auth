import { Router } from 'express'
import { ActivateUserMFAHTTPController } from './controllers/HTTP/ActivateUserMFAHTTPController'
import { ChangePasswordHTTPController } from './controllers/HTTP/ChangePasswordHTTPController'
import { ConfirmForgotPasswordHTTPController } from './controllers/HTTP/ConfirmForgotPasswordHTTPController'
import { ConfirmSignUpHTTPController } from './controllers/HTTP/ConfirmSignUpHTTPController'
import { DeleteUserHTTPController } from './controllers/HTTP/DeleteUserHTTPController'
import { DisableUserMFAHTTPController } from './controllers/HTTP/DisableUserMFAHTTPController'
import { ForgotPasswordHTTPController } from './controllers/HTTP/ForgotPasswordHTTPController'
import { GenerateTOTPQRHTTPController } from './controllers/HTTP/GenerateTOTPQRHTTPController'
import { GetUserHTTPController } from './controllers/HTTP/GetUserHTTPController'
import { LoginHTTPController } from './controllers/HTTP/LoginHTTPController'
import { LoginMFAHTTPController } from './controllers/HTTP/LoginMFAHTTPController'
import { RefreshTokenHTTPController } from './controllers/HTTP/RefreshTokenHTTPController'
import { ResendSignUpCodeHTTPController } from './controllers/HTTP/ResendSignUpCodeHTTPController'
import { SignUpHTTPController } from './controllers/HTTP/SignUpHTTPController'
import { VerifyAccessTokenHTTPController } from './controllers/HTTP/VerifyAccessTokenHTTPController'

const router = Router()

router.post('/auth/verify-access-token', async (req, res, next) => {
  return VerifyAccessTokenHTTPController.create().execute({ req, res, next })
})

router.post('/auth/signup', async (req, res, next) => {
  return SignUpHTTPController.create().execute({ req, res, next })
})

router.post('/auth/confirm-signup', async (req, res, next) => {
  return ConfirmSignUpHTTPController.create().execute({ req, res, next })
})

router.post('/auth/resend-signup-code', async (req, res, next) => {
  return ResendSignUpCodeHTTPController.create().execute({ req, res, next })
})

router.post('/auth/login', async (req, res, next) => {
  return LoginHTTPController.create().execute({ req, res, next })
})

router.post('/auth/mfa/login', async (req, res, next) => {
  return LoginMFAHTTPController.create().execute({ req, res, next })
})

router.post('/auth/mfa/generate-totp-qr', async (req, res, next) => {
  return GenerateTOTPQRHTTPController.create().execute({ req, res, next })
})

router.patch('/auth/mfa/activate', async (req, res, next) => {
  return ActivateUserMFAHTTPController.create().execute({ req, res, next })
})

router.patch('/auth/mfa/disable', async (req, res, next) => {
  return DisableUserMFAHTTPController.create().execute({ req, res, next })
})

router.get('/auth/get-user', async (req, res, next) => {
  return GetUserHTTPController.create().execute({ req, res, next })
})

router.post('/auth/refresh-token', async (req, res, next) => {
  return RefreshTokenHTTPController.create().execute({ req, res, next })
})

router.put('/auth/change-password', async (req, res, next) => {
  return ChangePasswordHTTPController.create().execute({ req, res, next })
})

router.post('/auth/forgot-password', async (req, res, next) => {
  return ForgotPasswordHTTPController.create().execute({ req, res, next })
})

router.post('/auth/confirm-forgot-password', async (req, res, next) => {
  return ConfirmForgotPasswordHTTPController.create().execute({ req, res, next })
})

router.delete('/auth/delete-user', async (req, res, next) => {
  return DeleteUserHTTPController.create().execute({ req, res, next })
})

export default router
