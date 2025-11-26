import { CONFIG, Config } from '../domain/config'

type ConfigTypes = keyof typeof CONFIG

interface AppContext {
  config: AppContextConfig
}

export interface AppContextConfig {
  get: (key: ConfigTypes) => (typeof CONFIG)[keyof Config]
}

export const appContext = (): AppContext => {
  const config = {
    get: (key: ConfigTypes) => CONFIG[key],
  }

  return { config }
}
