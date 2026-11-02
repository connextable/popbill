import type { CompatConfig } from '@/config'
import { createAccountCheckRuntimeMethods } from './runtime'
import type { AccountCheckCallbackService, AccountCheckPromiseService } from './types'

export function createAccountCheckService(config: CompatConfig): AccountCheckCallbackService {
  return createAccountCheckRuntimeMethods(config).callback
}

export function createAccountCheckPromiseService(config: CompatConfig): AccountCheckPromiseService {
  return createAccountCheckRuntimeMethods(config).promise
}
