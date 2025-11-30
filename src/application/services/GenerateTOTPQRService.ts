import { GenerateMFACodeUseCase } from '../useCases/GenerateMFACodeUseCase'
import { Request } from 'express'
import { GenerateTOTPQRUseCase } from '../useCases/GenerateTOTPQRUseCase'
import { GetUserUseCase } from '../useCases/GetUserUseCase'
import { AuthError, ErrorType } from '../../errors/AuthError'

export class GenerateTOTPQRService {
  #getUserUseCase
  #generateMFACodeUseCase
  #generateTOTPQRUseCase

  constructor({
    getUserUseCase,
    generateMFACodeUseCase,
    generateTOTPQRUseCase,
  }: {
    getUserUseCase: GetUserUseCase
    generateMFACodeUseCase: GenerateMFACodeUseCase
    generateTOTPQRUseCase: GenerateTOTPQRUseCase
  }) {
    this.#getUserUseCase = getUserUseCase
    this.#generateMFACodeUseCase = generateMFACodeUseCase
    this.#generateTOTPQRUseCase = generateTOTPQRUseCase
  }

  static create({ req }: { req: Request }) {
    const getUserUseCase = GetUserUseCase.create({ req })
    const generateMFACodeUseCase = GenerateMFACodeUseCase.create({ req })
    const generateTOTPQRUseCase = GenerateTOTPQRUseCase.create()

    return new GenerateTOTPQRService({ getUserUseCase, generateMFACodeUseCase, generateTOTPQRUseCase })
  }

  async execute({ accessToken, TOTPName }: { accessToken: string; TOTPName: string }) {
    const userResponse = await this.#getUserUseCase.execute({ accessToken })

    const { isMFAEnabled } = userResponse

    if (isMFAEnabled) {
      throw new AuthError({
        message: `[${GenerateTOTPQRService.name}#execute] MFA is already enabled`,
        type: ErrorType.GENERATE_TOTP_QR,
        status: 409,
      })
    }

    const generateMFACodeResponse = await this.#generateMFACodeUseCase.execute({ accessToken })

    return this.#generateTOTPQRUseCase.execute({ username: TOTPName, secretCode: generateMFACodeResponse.secretCode, issuer: 'Ananda Salut' })
  }
}
