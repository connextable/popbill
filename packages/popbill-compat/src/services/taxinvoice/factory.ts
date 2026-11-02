import type { CompatConfig } from '@/config'
import { createTaxinvoiceRuntimeMethods } from './runtime'
import type { TaxinvoiceCallbackService, TaxinvoicePromiseService } from './types'

export function createTaxinvoiceService(config: CompatConfig): TaxinvoiceCallbackService {
  return createTaxinvoiceRuntimeMethods(config).callback
}

export function createTaxinvoicePromiseService(config: CompatConfig): TaxinvoicePromiseService {
  return createTaxinvoiceRuntimeMethods(config).promise
}
