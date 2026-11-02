import type * as Spec from '@connextable/popbill-spec'
import { documentPath, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'

export function requestGetXML(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  confirmationNumber: string,
  userId?: string
): Promise<Spec.HomeTaxTaxInvoiceXmlApiResponse> {
  return request(context, corpNum, `${documentPath(confirmationNumber)}?T=xml`, userId)
}
