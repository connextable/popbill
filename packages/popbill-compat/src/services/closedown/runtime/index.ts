import type { CompatConfig } from '@/config'
import { createLookupRuntimeMethods } from '@/internal/lookup-runtime'
import type { ClosedownCallbackService, ClosedownPromiseService } from '../types'
import { createClosedownRuntimeContext } from './context'
import * as methods from './methods'

export function createClosedownRuntimeMethods(config: CompatConfig) {
  const context = createClosedownRuntimeContext(config)
  return createLookupRuntimeMethods<ClosedownCallbackService, ClosedownPromiseService>(config, 'ClosedownService', {
    checkCorpNum: methods.requestCheckCorpNum.bind(null, context),
    checkCorpNums: methods.requestCheckCorpNums.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
    getUnitCost: methods.requestGetUnitCost.bind(null, context),
  })
}
