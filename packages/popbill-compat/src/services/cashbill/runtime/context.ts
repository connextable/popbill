import { LinkhubAuthScope, type PopbillRequestClient } from '@connextable/popbill-runtime'
import type { CompatConfig } from '@/config'
import type { CompatRuntimeError } from '@/internal/errors'
import { createCompatRequestClient } from '@/internal/request-client'

export interface CashbillRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}

export function createCashbillRuntimeContext(config: CompatConfig): CashbillRuntimeContext {
  return {
    requestClient: createCompatRequestClient(config, [LinkhubAuthScope.Member, LinkhubAuthScope.CashReceipt]),
    defaultErrorHandler: config.defaultErrorHandler,
  }
}
