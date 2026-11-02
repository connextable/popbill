import { request, documentPath, requiredText } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSendEmail(
  context: CashbillRuntimeContext,
  corpNum: string,
  mgtKey: string,
  receiver: string,
  userId?: string
): Promise<Spec.CashbillApiResponseBase> {
  requiredText(receiver, '수신자 이메일이 입력되지 않았습니다.')
  return request(context, corpNum, documentPath(mgtKey), userId, 'EMAIL', { receiver })
}
