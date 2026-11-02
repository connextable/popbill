import { documentPath, request, requiredText } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSendEmail(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  receiver: string,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  requiredText(receiver, '수신자 메일이 입력되지 않았습니다.')
  return request(context, corpNum, documentPath(itemCode, mgtKey), userId, 'EMAIL', { receiver })
}
