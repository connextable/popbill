import type { PopbillRequestClient } from '@connextable/popbill-core'
import type { CompatConfig } from '@/config'
import type { CompatRuntimeError } from '@/internal/errors'
import { createTaxinvoiceRequestClient } from '@/internal/request-client'

export interface TaxinvoiceRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}

export function createTaxinvoiceRuntimeContext(config: CompatConfig): TaxinvoiceRuntimeContext {
  return {
    requestClient: createTaxinvoiceRequestClient(config),
    defaultErrorHandler: typeof config.defaultErrorHandler === 'function'
      ? error => config.defaultErrorHandler?.(error)
      : undefined,
  }
}
