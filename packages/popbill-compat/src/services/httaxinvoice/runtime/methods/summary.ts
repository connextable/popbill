import type * as Spec from '@connextable/popbill-spec'
import { filterQuery, jobPath, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'
export function requestSummary(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  jobId: string,
  type?: string[],
  taxType?: string[],
  purposeType?: string[],
  taxRegIdType?: string,
  taxRegIdYn?: string,
  taxRegId?: string,
  userId?: string,
  searchString?: string
): Promise<Spec.HomeTaxTaxInvoiceSummaryApiResponse> {
  return request(
    context,
    corpNum,
    `${jobPath(jobId)}/Summary?${filterQuery(type, taxType, purposeType, taxRegIdType, taxRegIdYn, taxRegId, searchString)}`,
    userId
  )
}
