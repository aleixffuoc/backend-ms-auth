import { GetUserUseCase } from '../useCases/GetUserUseCase'
import { RefreshTokenUseCase } from '../useCases/RefreshTokenUseCase'

export class RefreshTokenService {
  #refreshTokenUseCase
  #getUserUserCase

  constructor({ getUserUserCase, refreshTokenUseCase }: { refreshTokenUseCase: RefreshTokenUseCase; getUserUserCase: GetUserUseCase }) {
    this.#getUserUserCase = getUserUserCase
    this.#refreshTokenUseCase = refreshTokenUseCase
  }

  static create() {
    const refreshTokenUseCase = RefreshTokenUseCase.create()
    const getUserUserCase = GetUserUseCase.create()

    return new RefreshTokenService({ getUserUserCase, refreshTokenUseCase })
  }

  async execute({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
    const userReponse = await this.#getUserUserCase.execute({ accessToken })

    const { username } = userReponse

    return this.#refreshTokenUseCase.execute({ username, refreshToken })
  }
}
