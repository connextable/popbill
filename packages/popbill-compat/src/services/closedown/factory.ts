import type { CompatConfig } from '@/config'
import { createClosedownRuntimeMethods } from './runtime'
import type { ClosedownCallbackService, ClosedownPromiseService } from './types'

export function createClosedownService(config: CompatConfig): ClosedownCallbackService {
  return createClosedownRuntimeMethods(config).callback
}

export function createClosedownPromiseService(config: CompatConfig): ClosedownPromiseService {
  return createClosedownRuntimeMethods(config).promise
}
