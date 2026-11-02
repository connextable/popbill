import type { PopbillRequestClient } from '@connextable/popbill-runtime'
import { PopbillAuthScopes } from '@connextable/popbill-spec'
import type { CompatConfig } from '@/config'
import { createCompatRequestClient } from '@/internal/request-client'

export interface EasyFinBankRuntimeContext {
  requestClient: PopbillRequestClient
}

export function createEasyFinBankRuntimeContext(config: CompatConfig): EasyFinBankRuntimeContext {
  return { requestClient: createCompatRequestClient(config, [PopbillAuthScopes.Member, PopbillAuthScopes.AccountCheck]) }
}
