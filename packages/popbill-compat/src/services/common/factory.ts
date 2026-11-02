import type { CompatConfig } from '@/config'
import { createLookupRuntimeMethods } from '@/internal/lookup-runtime'
import { createCommonRuntimeContext } from './runtime/context'
import * as methods from './runtime/methods'
import type { CommonCallbackService, CommonPromiseService } from './types'

function createMethods(config: CompatConfig) {
  const context = createCommonRuntimeContext(config)
  const requests = methods.createCommonRequests(context)
  return createLookupRuntimeMethods<CommonCallbackService, CommonPromiseService>(config, 'CommonService', { ...requests })
}
export function createCommonService(config: CompatConfig): CommonCallbackService {
  return createMethods(config).callback
}
export function createCommonPromiseService(config: CompatConfig): CommonPromiseService {
  return createMethods(config).promise
}
