import { request, requiredText, validateStatement } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestFaxSend(
  context: StatementRuntimeContext,
  corpNum: string,
  statement: Spec.StatementApiModel,
  sendNum: string,
  receiveNum: string,
  userId?: string
): Promise<string> {
  validateStatement(statement)
  requiredText(sendNum, '발신번호가 입력되지 않았습니다.')
  requiredText(receiveNum, '수신번호가 입력되지 않았습니다.')
  const response = await request<{ receiptNum: string }>(context, corpNum, '/Statement', userId, 'FAX', { ...statement, sendNum, receiveNum })
  return response.receiptNum
}
