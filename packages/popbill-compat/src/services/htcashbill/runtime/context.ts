import type { CompatConfig } from '@/config'
import type { CompatRuntimeError } from '@/internal/errors'
import { createCompatRequestClient } from '@/internal/request-client'
import type { PopbillRequestClient } from '@connextable/popbill-runtime'

export interface HTCashbillRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}

export function createHTCashbillRuntimeContext(config: CompatConfig): HTCashbillRuntimeContext {
  return {
    requestClient: createCompatRequestClient(config, ['member', '141']),
    defaultErrorHandler: typeof config.defaultErrorHandler === 'function' ? config.defaultErrorHandler : undefined,
  }
}
