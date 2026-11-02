import type * as Spec from '@connextable/popbill-spec'
import { jobPath, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'
export function requestGetJobState(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  jobId: string,
  userId?: string
): Promise<Spec.HomeTaxTaxInvoiceJobStateApiModel> {
  return request(context, corpNum, `${jobPath(jobId)}/State`, userId)
}
