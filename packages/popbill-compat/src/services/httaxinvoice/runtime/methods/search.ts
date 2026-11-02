import type * as Spec from '@connextable/popbill-spec'
import { filterQuery, jobPath, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'
export function requestSearch(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  jobId: string,
  type?: string[],
  taxType?: string[],
  purposeType?: string[],
  taxRegIdType?: string,
  taxRegIdYn?: string,
  taxRegId?: string,
  page?: number,
  perPage?: number,
  order?: string,
  userId?: string,
  searchString?: string
): Promise<Spec.HomeTaxTaxInvoiceSearchApiResponse> {
  let query = filterQuery(type, taxType, purposeType, taxRegIdType, taxRegIdYn, taxRegId, searchString)
  for (const [key, value] of Object.entries({ Page: page, PerPage: perPage, Order: order })) {
    if (value !== undefined && value !== null && value !== '') query += `&${key}=${encodeURIComponent(String(value))}`
  }
  return request(context, corpNum, `${jobPath(jobId)}?${query}`, userId)
}
