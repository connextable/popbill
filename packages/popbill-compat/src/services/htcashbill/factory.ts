import type { CompatConfig } from '@/config'
import { createTypedCallbackServiceStub } from '@/adapters/callback-adapter'
import { createTypedPromiseServiceStub } from '@/adapters/promise-adapter'
import { HTCASHBILL_METHODS } from './methods'
import { createHTCashbillRuntimeMethods } from './runtime'
import type { HTCashbillCallbackService, HTCashbillPromiseService } from './types'

export function createHTCashbillService(config: CompatConfig): HTCashbillCallbackService {
  return Object.assign(
    createTypedCallbackServiceStub<HTCashbillCallbackService>('HTCashbillService', HTCASHBILL_METHODS),
    createHTCashbillRuntimeMethods(config).callback
  )
}

export function createHTCashbillPromiseService(config: CompatConfig): HTCashbillPromiseService {
  return Object.assign(
    createTypedPromiseServiceStub<HTCashbillPromiseService>('HTCashbillService', HTCASHBILL_METHODS),
    createHTCashbillRuntimeMethods(config).promise
  )
}
