export interface CompatConfig {
  LinkID: string
  SecretKey: string
  IsTest?: boolean
  [key: string]: unknown
}

const DEFAULT_CONFIGURATION: CompatConfig = {
  LinkID: '',
  SecretKey: '',
  IsTest: false,
}

let currentConfiguration: CompatConfig = { ...DEFAULT_CONFIGURATION }

export function setConfiguration(config: CompatConfig): void {
  currentConfiguration = {
    ...currentConfiguration,
    ...config,
  }
}

export function getConfiguration(): CompatConfig {
  return {
    ...currentConfiguration,
  }
}
