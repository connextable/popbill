import { request, documentPath, requiredText } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSendSms(
  context: CashbillRuntimeContext,
  corpNum: string,
  mgtKey: string,
  sender: string,
  receiver: string,
  contents: string,
  userId?: string
): Promise<Spec.CashbillApiResponseBase> {
  requiredText(sender, '발신번호가 입력되지 않았습니다.')
  requiredText(receiver, '수신번호가 입력되지 않았습니다.')
  requiredText(contents, '메시지 내용이 입력되지 않았습니다.')
  return request(context, corpNum, documentPath(mgtKey), userId, 'SMS', { sender, receiver, contents })
}
