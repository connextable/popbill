import { LinkhubAuthScope } from '@connextable/popbill-runtime'
import type { CompatConfig } from '@/config'
import { createCompatRequestClient } from '@/internal/request-client'
import type { LookupRuntimeContext } from '@/internal/lookup-runtime'

export function createAccountCheckRuntimeContext(config: CompatConfig): LookupRuntimeContext {
  return {
    requestClient: createCompatRequestClient(config, [
      LinkhubAuthScope.Member,
      LinkhubAuthScope.DepositorNameCheck,
      LinkhubAuthScope.DepositorRealNameCheck,
    ]),
  }
}
