import type { CompatConfig } from '@/config'
import { createTypedCallbackServiceStub } from '@/adapters/callback-adapter'
import { createTypedPromiseServiceStub } from '@/adapters/promise-adapter'
import { HTTAXINVOICE_METHODS } from './methods'
import { createHTTaxinvoiceRuntimeMethods } from './runtime'
import type { HTTaxinvoiceCallbackService, HTTaxinvoicePromiseService } from './types'

export function createHTTaxinvoiceService(config: CompatConfig): HTTaxinvoiceCallbackService {
  return Object.assign(
    createTypedCallbackServiceStub<HTTaxinvoiceCallbackService>('HTTaxinvoiceService', HTTAXINVOICE_METHODS),
    createHTTaxinvoiceRuntimeMethods(config).callback
  )
}
export function createHTTaxinvoicePromiseService(config: CompatConfig): HTTaxinvoicePromiseService {
  return Object.assign(
    createTypedPromiseServiceStub<HTTaxinvoicePromiseService>('HTTaxinvoiceService', HTTAXINVOICE_METHODS),
    createHTTaxinvoiceRuntimeMethods(config).promise
  )
}
