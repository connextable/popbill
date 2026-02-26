import type { CompatConfig } from '@/config'
import { createTypedCallbackServiceStub } from '@/adapters/callback-adapter'
import { createTypedPromiseServiceStub } from '@/adapters/promise-adapter'
import { TAXINVOICE_METHODS } from './methods'
import { createTaxinvoiceRuntimeMethods } from './runtime'
import type { TaxinvoiceCallbackService, TaxinvoicePromiseService } from './types'

const SERVICE_NAME = 'TaxinvoiceService'

export function createTaxinvoiceService(config: CompatConfig): TaxinvoiceCallbackService {
  const service = createTypedCallbackServiceStub<TaxinvoiceCallbackService>(SERVICE_NAME, TAXINVOICE_METHODS)
  const runtimeMethods = createTaxinvoiceRuntimeMethods(config)

  Object.assign(service, runtimeMethods.callback)

  return service
}

export function createTaxinvoicePromiseService(config: CompatConfig): TaxinvoicePromiseService {
  const service = createTypedPromiseServiceStub<TaxinvoicePromiseService>(SERVICE_NAME, TAXINVOICE_METHODS)
  const runtimeMethods = createTaxinvoiceRuntimeMethods(config)

  Object.assign(service, runtimeMethods.promise)

  return service
}
