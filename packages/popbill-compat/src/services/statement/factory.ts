import type { CompatConfig } from '@/config'
import { createStatementRuntimeMethods } from './runtime'
import type { StatementCallbackService, StatementPromiseService } from './types'

/** Creates an isolated legacy callback service, without singleton configuration. */
export function createStatementService(config: CompatConfig): StatementCallbackService {
  return createStatementRuntimeMethods(config).callback
}

/** Creates an isolated positional Promise service. */
export function createStatementPromiseService(config: CompatConfig): StatementPromiseService {
  return createStatementRuntimeMethods(config).promise
}
