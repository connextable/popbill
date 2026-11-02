import { LinkhubAuthScope, type PopbillRequestClient } from '@connextable/popbill-runtime'
import type { CompatConfig } from '@/config'
import type { CompatRuntimeError } from '@/internal/errors'
import { createCompatRequestClient } from '@/internal/request-client'
export interface MessageRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}
export function createMessageRuntimeContext(config: CompatConfig): MessageRuntimeContext {
  return {
    requestClient: createCompatRequestClient(config, [LinkhubAuthScope.Member, LinkhubAuthScope.SMS, LinkhubAuthScope.LMS, LinkhubAuthScope.MMS]),
    defaultErrorHandler: config.defaultErrorHandler,
  }
}
