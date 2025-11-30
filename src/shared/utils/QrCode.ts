import QRCode from 'qrcode'
import { AuthError, ErrorType } from '../../errors/AuthError'

export class QrCode {
  static create() {
    return new QrCode()
  }

  async generateUrl({ totpURI }: { totpURI: string }) {
    try {
      return await QRCode.toDataURL(totpURI)
    } catch (error: any) {
      throw AuthError.create({ message: error.message, type: ErrorType.GENERATE_QR_CODE, status: 500 })
    }
  }
}
