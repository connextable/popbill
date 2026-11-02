import { request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestGetChargeInfo(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.HomeTaxCashbillChargeInfoApiModel> {
  return request(context, corpNum, '/HomeTax/Cashbill/ChargeInfo', userId, 'GET')
}
