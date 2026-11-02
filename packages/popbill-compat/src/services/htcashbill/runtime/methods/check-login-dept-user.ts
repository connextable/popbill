import { request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestCheckLoginDeptUser(context: HTCashbillRuntimeContext, corpNum: string): Promise<Spec.HomeTaxCashbillApiResponseBase> {
  return request(context, corpNum, '/HomeTax/Cashbill/DeptUser/Check', undefined, 'GET')
}
