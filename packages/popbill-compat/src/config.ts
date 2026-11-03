import type { PopbillApiError } from '@/errors'
import type { RequestContext } from '@connextable/popbill-runtime'

export interface CompatConfig {
  fetch?: typeof globalThis.fetch
  requestContext?: RequestContext
  LinkID: string
  SecretKey: string
  IsTest?: boolean
  UseStaticIP?: boolean
  UseGAIP?: boolean
  UseLocalTimeYN?: boolean
  IPRestrictOnOff?: boolean
  acceptEncoding?: string | null
  acceptLanguage?: string
  requestTimeoutMs?: number
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
  acceptEncoding: 'gzip,deflate',
  requestTimeoutMs: 180_000,
}

let currentConfiguration: CompatConfig = { ...DEFAULT_CONFIGURATION }
const configurationChangeListeners = new Set<() => void>()

export function setConfiguration(config: CompatConfig): void {
  currentConfiguration = {
    ...currentConfiguration,
    ...config,
  }

  for (const listener of configurationChangeListeners) {
    listener()
  }
}

export function getConfiguration(): CompatConfig {
  return {
    ...currentConfiguration,
  }
}

export function registerConfigurationChangeListener(listener: () => void): () => void {
  configurationChangeListeners.add(listener)

  return () => {
    configurationChangeListeners.delete(listener)
  }
}
