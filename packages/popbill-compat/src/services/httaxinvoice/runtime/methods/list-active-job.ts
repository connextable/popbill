import type * as Spec from '@connextable/popbill-spec'
import { BASE_PATH, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'

export function requestListActiveJob(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.HomeTaxTaxInvoiceJobStateApiModel[]> {
  return request(context, corpNum, `${BASE_PATH}/JobList`, userId)
}
