import type { CompatConfig } from '@/config'
import { createFaxRuntimeMethods } from './runtime'
import type { FaxCallbackService, FaxPromiseService } from './types'

export function createFaxService(config: CompatConfig): FaxCallbackService {
  return createFaxRuntimeMethods(config).callback
}
export function createFaxPromiseService(config: CompatConfig): FaxPromiseService {
  return createFaxRuntimeMethods(config).promise
}
