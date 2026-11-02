import type { CompatConfig } from '@/config'
import { createCashbillRuntimeMethods } from './runtime'
import type { CashbillCallbackService, CashbillPromiseService } from './types'

export function createCashbillService(config: CompatConfig): CashbillCallbackService {
  return createCashbillRuntimeMethods(config).callback
}

export function createCashbillPromiseService(config: CompatConfig): CashbillPromiseService {
  return createCashbillRuntimeMethods(config).promise
}
