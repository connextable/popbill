import { BASE_PATH, request } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'
export async function requestGetCertificateExpireDate(context: HTTaxinvoiceRuntimeContext, corpNum: string): Promise<string> {
  return (await request<{ certificateExpiration: string }>(context, corpNum, `${BASE_PATH}/CertInfo`)).certificateExpiration
}
