import { documentPath, url } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'

export function requestGetPrintURL(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  confirmationNumber: string,
  userId?: string
): Promise<string> {
  return url(context, corpNum, `${documentPath(confirmationNumber)}/Print`, userId)
}
