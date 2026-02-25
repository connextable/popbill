import type { CompatConfig } from '../config'
import { createCallbackServiceStub, type CallbackService } from '../adapters/callback-adapter'
import { createPromiseServiceStub, type PromiseService } from '../adapters/promise-adapter'

const SERVICE_NAME = 'TaxinvoiceService'

export function createTaxinvoiceService(_config: CompatConfig): CallbackService {
  return createCallbackServiceStub(SERVICE_NAME)
}

export function createTaxinvoicePromiseService(_config: CompatConfig): PromiseService {
  return createPromiseServiceStub(SERVICE_NAME)
}
