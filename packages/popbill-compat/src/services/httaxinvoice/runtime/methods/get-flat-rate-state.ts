import type * as Spec from '@connextable/popbill-spec'
import { BASE_PATH, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'

export function requestGetFlatRateState(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.HomeTaxTaxInvoiceFlatRateStateApiModel> {
  return request(context, corpNum, `${BASE_PATH}/Contract`, userId)
}
