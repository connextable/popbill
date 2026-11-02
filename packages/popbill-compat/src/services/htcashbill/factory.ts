import type { CompatConfig } from '@/config'
import { createHTCashbillRuntimeMethods } from './runtime'
import type { HTCashbillCallbackService, HTCashbillPromiseService } from './types'

export function createHTCashbillService(config: CompatConfig): HTCashbillCallbackService {
  return createHTCashbillRuntimeMethods(config).callback
}

export function createHTCashbillPromiseService(config: CompatConfig): HTCashbillPromiseService {
  return createHTCashbillRuntimeMethods(config).promise
}
