import type * as Spec from '@connextable/popbill-spec'
import { requestLookup, type LookupRuntimeContext } from '@/internal/lookup-runtime'

export function requestGetChargeInfo(context: LookupRuntimeContext, corpNum: string, userId?: string): Promise<Spec.ClosedownChargeInfoApiResponse> {
  return requestLookup(context, corpNum, '/CloseDown/ChargeInfo', userId)
}
