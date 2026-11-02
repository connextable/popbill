import { LinkhubAuthScope, type PopbillRequestClient } from '@connextable/popbill-runtime'
import type { CompatConfig } from '@/config'
import type { CompatRuntimeError } from '@/internal/errors'
import { createCompatRequestClient } from '@/internal/request-client'

export interface FaxRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}
export function createFaxRuntimeContext(config: CompatConfig): FaxRuntimeContext {
  return {
    requestClient: createCompatRequestClient(config, [LinkhubAuthScope.Member, LinkhubAuthScope.Fax, LinkhubAuthScope.IntelligentFax]),
    defaultErrorHandler: config.defaultErrorHandler,
  }
}
