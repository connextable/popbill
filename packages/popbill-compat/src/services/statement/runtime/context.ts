import type { PopbillRequestClient } from '@connextable/popbill-runtime'
import type { CompatConfig } from '@/config'
import type { CompatRuntimeError } from '@/internal/errors'
import { createStatementRequestClient } from '@/internal/request-client'

export interface StatementRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}

export function createStatementRuntimeContext(config: CompatConfig): StatementRuntimeContext {
  const defaultErrorHandler = config.defaultErrorHandler

  return {
    requestClient: createStatementRequestClient(config),
    defaultErrorHandler: typeof defaultErrorHandler === 'function' ? defaultErrorHandler : undefined,
  }
}
