import { LinkhubAuthScope, type PopbillRequestClient } from '@connextable/popbill-runtime'
import type { CompatConfig } from '@/config'
import { createCompatRequestClient } from '@/internal/request-client'
import type { CompatRuntimeError } from '@/internal/errors'

export interface HTTaxinvoiceRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}
export function createHTTaxinvoiceRuntimeContext(config: CompatConfig): HTTaxinvoiceRuntimeContext {
  return {
    requestClient: createCompatRequestClient(config, [LinkhubAuthScope.Member, LinkhubAuthScope.HomeTaxTaxInvoice]),
    defaultErrorHandler: typeof config.defaultErrorHandler === 'function' ? config.defaultErrorHandler : undefined,
  }
}
