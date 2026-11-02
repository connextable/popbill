import { request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestListActiveJob(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.HomeTaxCashbillJobStateApiModel[]> {
  return request(context, corpNum, '/HomeTax/Cashbill/JobList', userId, 'GET')
}
