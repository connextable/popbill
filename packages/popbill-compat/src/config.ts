import type { PopbillApiError } from '@connextable/popbill-core'

export interface CompatConfig {
  LinkID: string
  SecretKey: string
  IsTest?: boolean
  UseStaticIP?: boolean
  UseGAIP?: boolean
  UseLocalTimeYN?: boolean
  IPRestrictOnOff?: boolean
  requestTimeoutMs?: number
  acceptLanguage?: string
  acceptEncoding?: string | null
  defaultErrorHandler?: (error: PopbillApiError | { code: number; message: string }) => void
  [key: string]: unknown
}

const DEFAULT_CONFIGURATION: CompatConfig = {
  LinkID: '',
  SecretKey: '',
  IsTest: false,
  UseStaticIP: false,
  UseGAIP: false,
  UseLocalTimeYN: true,
  IPRestrictOnOff: true,
  requestTimeoutMs: 180_000,
  acceptEncoding: 'gzip,deflate',
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
