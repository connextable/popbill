import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { parseResendOptions, resendBody, request, numberPath } from '../common'

export async function requestResendFax(context: FaxRuntimeContext, corpNum: string, ...args: unknown[]): Promise<string> {
  const options = parseResendOptions(false, args)
  const uri = numberPath('/FAX/', options.ReceiptNum!, '팩스접수번호(ReceiptNum)가 입력되지 않았습니다.')
  return (await request<Spec.FaxReceiptApiResponse>(context, corpNum, uri, options.UserID, 'POST', resendBody(options))).receiptNum
}
