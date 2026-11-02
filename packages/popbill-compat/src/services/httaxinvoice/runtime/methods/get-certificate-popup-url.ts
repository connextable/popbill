import { BASE_PATH, url } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'

export function requestGetCertificatePopUpURL(context: HTTaxinvoiceRuntimeContext, corpNum: string, userId?: string): Promise<string> {
  return url(context, corpNum, `${BASE_PATH}?TG=CERT`, userId)
}
