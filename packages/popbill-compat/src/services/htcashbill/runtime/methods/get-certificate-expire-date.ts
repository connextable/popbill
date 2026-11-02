import { request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetCertificateExpireDate(context: HTCashbillRuntimeContext, corpNum: string): Promise<string> {
  const response = await request<Spec.HomeTaxCashbillGetCertificateExpireDateApiResponse>(context, corpNum, '/HomeTax/Cashbill/CertInfo')
  return response.certificateExpiration
}
