import type * as Spec from '@connextable/popbill-spec'
import { documentPath, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'

export function requestGetTaxinvoice(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  confirmationNumber: string,
  userId?: string
): Promise<Spec.HomeTaxTaxInvoiceApiModel> {
  return request(context, corpNum, `${documentPath(confirmationNumber)}`, userId)
}
