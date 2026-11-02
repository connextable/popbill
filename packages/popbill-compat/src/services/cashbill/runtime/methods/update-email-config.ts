import { createLegacyValidationError } from '@/internal/errors'
import { request, requiredText } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestUpdateEmailConfig(
  context: CashbillRuntimeContext,
  corpNum: string,
  emailType: string,
  sendYN: boolean,
  userId?: string
): Promise<Spec.CashbillApiResponseBase> {
  requiredText(emailType, '메일 전송 유형이 입력되지 않았습니다.')
  if (typeof sendYN !== 'boolean') throw createLegacyValidationError('메일 전송 여부가 올바르지 않습니다.')
  const query = new URLSearchParams({ EmailType: emailType, SendYN: String(sendYN) })
  return request(context, corpNum, `/Cashbill/EmailSendConfig?${query.toString()}`, userId, 'POST')
}
