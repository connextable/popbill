import { request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestGetFlatRateState(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.HomeTaxCashbillFlatRateStateApiModel> {
  return request(context, corpNum, '/HomeTax/Cashbill/Contract', userId, 'GET')
}
