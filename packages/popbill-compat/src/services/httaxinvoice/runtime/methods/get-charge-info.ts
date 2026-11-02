import type * as Spec from '@connextable/popbill-spec'
import { BASE_PATH, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'

export function requestGetChargeInfo(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.HomeTaxTaxInvoiceChargeInfoApiResponse> {
  return request(context, corpNum, `${BASE_PATH}/ChargeInfo`, userId)
}
