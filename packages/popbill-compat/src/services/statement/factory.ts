import type { CompatConfig } from '@/config'
import { createTypedCallbackServiceStub } from '@/adapters/callback-adapter'
import { createTypedPromiseServiceStub } from '@/adapters/promise-adapter'
import { STATEMENT_METHODS } from './methods'
import { createStatementRuntimeMethods } from './runtime'
import type { StatementCallbackService, StatementPromiseService } from './types'

const SERVICE_NAME = 'StatementService'

/** Creates an isolated legacy callback service, without singleton configuration. */
export function createStatementService(config: CompatConfig): StatementCallbackService {
  const service = createTypedCallbackServiceStub<StatementCallbackService>(SERVICE_NAME, STATEMENT_METHODS)
  const runtimeMethods = createStatementRuntimeMethods(config)

  Object.assign(service, runtimeMethods.callback)

  return service
}

/** Creates an isolated positional Promise service. */
export function createStatementPromiseService(config: CompatConfig): StatementPromiseService {
  const service = createTypedPromiseServiceStub<StatementPromiseService>(SERVICE_NAME, STATEMENT_METHODS)
  const runtimeMethods = createStatementRuntimeMethods(config)

  Object.assign(service, runtimeMethods.promise)

  return service
}
