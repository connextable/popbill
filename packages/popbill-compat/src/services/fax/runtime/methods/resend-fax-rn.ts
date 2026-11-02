import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { parseResendOptions, resendBody, request, numberPath } from '../common'

export async function requestResendFaxRN(context: FaxRuntimeContext, corpNum: string, ...args: unknown[]): Promise<string> {
  const options = parseResendOptions(true, args)
  const uri = numberPath('/FAX/Resend/', options.OrgRequestNum!, '원본 팩스 요청번호가 입력되지 않았습니다.')
  return (await request<Spec.FaxReceiptApiResponse>(context, corpNum, uri, options.UserID, 'POST', resendBody(options))).receiptNum
}
