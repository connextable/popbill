import { jobPath, request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestGetJobState(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  jobId: string,
  userId?: string
): Promise<Spec.HomeTaxCashbillJobStateApiModel> {
  return request(context, corpNum, `${jobPath(jobId)}/State`, userId)
}
