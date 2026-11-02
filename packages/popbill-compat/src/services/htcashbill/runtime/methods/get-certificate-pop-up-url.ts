import { request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'

export async function requestGetCertificatePopUpURL(context: HTCashbillRuntimeContext, corpNum: string, userId?: string): Promise<string> {
  const response = await request<{ url: string }>(context, corpNum, '/HomeTax/Cashbill?TG=CERT', userId)
  return response.url
}
