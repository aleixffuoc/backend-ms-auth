import { QrCode } from '../../shared/utils/QrCode'

const TOTP_DIGITS = 6
const RESET_TOTP_PERIOD_SEC = 30

export class GenerateTOTPQRUseCase {
  #qrCode

  constructor({ qrCode }: { qrCode: QrCode }) {
    this.#qrCode = qrCode
  }

  static create() {
    return new GenerateTOTPQRUseCase({
      qrCode: QrCode.create(),
    })
  }

  async execute({ secretCode, username, issuer }: { secretCode: string; username: string; issuer: string }) {
    const TOTP_URI = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(username)}?secret=${secretCode}&issuer=${encodeURIComponent(
      issuer
    )}&digits=${TOTP_DIGITS}&period=${RESET_TOTP_PERIOD_SEC}`

    return this.#qrCode.generateUrl({ totpURI: TOTP_URI })
  }
}
