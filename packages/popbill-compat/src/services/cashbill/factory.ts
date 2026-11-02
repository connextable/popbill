import type { CompatConfig } from '@/config'
import { createTypedCallbackServiceStub } from '@/adapters/callback-adapter'
import { createTypedPromiseServiceStub } from '@/adapters/promise-adapter'
import { CASHBILL_METHODS } from './methods'
import { createCashbillRuntimeMethods } from './runtime'
import type { CashbillCallbackService, CashbillPromiseService } from './types'

export function createCashbillService(config: CompatConfig): CashbillCallbackService {
  const service = createTypedCallbackServiceStub<CashbillCallbackService>('CashbillService', CASHBILL_METHODS)
  Object.assign(service, createCashbillRuntimeMethods(config).callback)
  return service
}

export function createCashbillPromiseService(config: CompatConfig): CashbillPromiseService {
  const service = createTypedPromiseServiceStub<CashbillPromiseService>('CashbillService', CASHBILL_METHODS)
  Object.assign(service, createCashbillRuntimeMethods(config).promise)
  return service
}
