import type { CompatConfig } from '@/config'
import { createTypedCallbackServiceStub } from '@/adapters/callback-adapter'
import { createTypedPromiseServiceStub } from '@/adapters/promise-adapter'
import { FAX_METHODS } from './methods'
import { createFaxRuntimeMethods } from './runtime'
import type { FaxCallbackService, FaxPromiseService } from './types'

export function createFaxService(config: CompatConfig): FaxCallbackService {
  return Object.assign(createTypedCallbackServiceStub<FaxCallbackService>('FaxService', FAX_METHODS), createFaxRuntimeMethods(config).callback)
}
export function createFaxPromiseService(config: CompatConfig): FaxPromiseService {
  return Object.assign(createTypedPromiseServiceStub<FaxPromiseService>('FaxService', FAX_METHODS), createFaxRuntimeMethods(config).promise)
}
