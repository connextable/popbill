import { documentPath, request, requiredText } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSendSms(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  sender: string,
  receiver: string,
  contents: string,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  requiredText(sender, '발신번호가 입력되지 않았습니다.')
  requiredText(receiver, '수신번호가 입력되지 않았습니다.')
  return request(context, corpNum, documentPath(itemCode, mgtKey), userId, 'SMS', { sender, receiver, contents })
}
