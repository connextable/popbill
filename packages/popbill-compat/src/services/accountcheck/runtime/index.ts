import type { CompatConfig } from '@/config'
import { createLookupRuntimeMethods } from '@/internal/lookup-runtime'
import type { AccountCheckCallbackService, AccountCheckPromiseService } from '../types'
import { createAccountCheckRuntimeContext } from './context'
import * as methods from './methods'

export function createAccountCheckRuntimeMethods(config: CompatConfig) {
  const context = createAccountCheckRuntimeContext(config)
  return createLookupRuntimeMethods<AccountCheckCallbackService, AccountCheckPromiseService>(config, 'AccountCheckService', {
    checkAccountInfo: methods.requestCheckAccountInfo.bind(null, context),
    checkDepositorInfo: methods.requestCheckDepositorInfo.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
    getUnitCost: methods.requestGetUnitCost.bind(null, context),
  })
}
