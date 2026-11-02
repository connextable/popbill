import type { PopbillRequestClient } from '@connextable/popbill-runtime'
import type * as Spec from '@connextable/popbill-spec'
import type { CompatConfig } from '@/config'
import { createCompatRequestClient } from '@/internal/request-client'
import type { CompatRuntimeError } from '@/internal/errors'
export interface KakaoRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}
export function createKakaoRuntimeContext(config: CompatConfig): KakaoRuntimeContext {
  // 154/155 retain the original friendtalk API; 156–158 add current brand messaging.
  return {
    requestClient: createCompatRequestClient(config, ['member', '153', '154', '155', '156', '157', '158', '159'] as Spec.LinkhubAuthScope[]),
    defaultErrorHandler: config.defaultErrorHandler,
  }
}
