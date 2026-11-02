import { request } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetChargeInfo(
  context: CashbillRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.CashbillChargeInfoApiResponse> {
  return request(context, corpNum, '/Cashbill/ChargeInfo', userId)
}
