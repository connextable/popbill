import { request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestCheckDeptUser(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.HomeTaxCashbillApiResponseBase> {
  return request(context, corpNum, '/HomeTax/Cashbill/DeptUser', userId, 'GET')
}
