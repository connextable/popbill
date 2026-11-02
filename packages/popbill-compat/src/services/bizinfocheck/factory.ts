import type { CompatConfig } from '@/config'
import { createBizInfoCheckRuntimeMethods } from './runtime'
import type { BizInfoCheckCallbackService, BizInfoCheckPromiseService } from './types'

export function createBizInfoCheckService(config: CompatConfig): BizInfoCheckCallbackService {
  return createBizInfoCheckRuntimeMethods(config).callback
}

export function createBizInfoCheckPromiseService(config: CompatConfig): BizInfoCheckPromiseService {
  return createBizInfoCheckRuntimeMethods(config).promise
}
