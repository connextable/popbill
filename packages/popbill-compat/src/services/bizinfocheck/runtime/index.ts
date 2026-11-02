import type { CompatConfig } from '@/config'
import { createLookupRuntimeMethods } from '@/internal/lookup-runtime'
import type { BizInfoCheckCallbackService, BizInfoCheckPromiseService } from '../types'
import { createBizInfoCheckRuntimeContext } from './context'
import * as methods from './methods'

export function createBizInfoCheckRuntimeMethods(config: CompatConfig) {
  const context = createBizInfoCheckRuntimeContext(config)
  return createLookupRuntimeMethods<BizInfoCheckCallbackService, BizInfoCheckPromiseService>(config, 'BizInfoCheckService', {
    checkBizInfo: methods.requestCheckBizInfo.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
    getUnitCost: methods.requestGetUnitCost.bind(null, context),
  })
}
