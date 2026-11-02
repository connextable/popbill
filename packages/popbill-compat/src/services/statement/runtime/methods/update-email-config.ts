import { createLegacyValidationError } from '@/internal/errors'
import { request, requiredText } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestUpdateEmailConfig(
  context: StatementRuntimeContext,
  corpNum: string,
  emailType: string,
  sendYN: boolean,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  requiredText(emailType, '메일전송타입(EmailType)이 입력되지 않았습니다.')
  if (typeof sendYN !== 'boolean') throw createLegacyValidationError('메일전송여부(SendYN)가 입력되지 않았습니다.')
  const query = new URLSearchParams({ EmailType: emailType, SendYN: String(sendYN) })
  return request(context, corpNum, `/Statement/EmailSendConfig?${query.toString()}`, userId, 'POST')
}
