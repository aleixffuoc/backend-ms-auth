import { AuthError, ErrorType } from '../../errors/AuthError'
import { GenerateMFACodeUseCase } from '../useCases/GenerateMFACodeUseCase'
import { GenerateTOTPQRUseCase } from '../useCases/GenerateTOTPQRUseCase'
import { GetUserUseCase } from '../useCases/GetUserUseCase'

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

  static create() {
    const getUserUseCase = GetUserUseCase.create()
    const generateMFACodeUseCase = GenerateMFACodeUseCase.create()
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
