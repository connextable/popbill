import type { CompatConfig } from '@/config'
import { createEasyFinBankRuntimeMethods } from './runtime'
import type { EasyFinBankCallbackService, EasyFinBankPromiseService } from './types'

export function createEasyFinBankService(config: CompatConfig): EasyFinBankCallbackService {
  return createEasyFinBankRuntimeMethods(config).callback
}

export function createEasyFinBankPromiseService(config: CompatConfig): EasyFinBankPromiseService {
  return createEasyFinBankRuntimeMethods(config).promise
}
