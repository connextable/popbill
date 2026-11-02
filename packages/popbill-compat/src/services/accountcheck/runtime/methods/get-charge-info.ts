import type * as Spec from '@connextable/popbill-spec'
import { requestLookup, type LookupRuntimeContext } from '@/internal/lookup-runtime'
import { costQuery } from '../common'

export function requestGetChargeInfo(
  context: LookupRuntimeContext,
  corpNum: string,
  serviceType?: string,
  userId?: string
): Promise<Spec.AccountCheckChargeInfoApiResponse> {
  return requestLookup(context, corpNum, `/EasyFin/AccountCheck/ChargeInfo${costQuery(serviceType)}`, userId)
}
