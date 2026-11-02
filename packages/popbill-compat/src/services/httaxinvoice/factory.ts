import type { CompatConfig } from '@/config'
import { createHTTaxinvoiceRuntimeMethods } from './runtime'
import type { HTTaxinvoiceCallbackService, HTTaxinvoicePromiseService } from './types'

export function createHTTaxinvoiceService(config: CompatConfig): HTTaxinvoiceCallbackService {
  return createHTTaxinvoiceRuntimeMethods(config).callback
}
export function createHTTaxinvoicePromiseService(config: CompatConfig): HTTaxinvoicePromiseService {
  return createHTTaxinvoiceRuntimeMethods(config).promise
}
