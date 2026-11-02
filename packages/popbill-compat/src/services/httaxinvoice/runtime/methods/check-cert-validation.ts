import type * as Spec from '@connextable/popbill-spec'
import { BASE_PATH, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'

export function requestCheckCertValidation(context: HTTaxinvoiceRuntimeContext, corpNum: string): Promise<Spec.HomeTaxTaxInvoiceApiResponseBase> {
  return request(context, corpNum, `${BASE_PATH}/CertCheck`, undefined)
}
