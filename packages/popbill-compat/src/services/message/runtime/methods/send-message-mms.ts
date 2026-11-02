import { createLegacyValidationError } from '@/internal/errors'
import { send } from '../common'
import type { MessageRuntimeContext } from '../context'
import type { MessageRecipient } from '../../types'

export async function requestSendMessage_MMS(
  context: MessageRuntimeContext,
  corpNum: string,
  sender: string,
  senderName: string,
  subject: string,
  contents: string,
  messages: MessageRecipient | MessageRecipient[],
  filePath: string,
  reserveDT?: string,
  adsYN?: boolean,
  requestNum?: string,
  userId?: string
): Promise<string> {
  if (typeof filePath !== 'string') throw createLegacyValidationError('첨부파일 경로는 문자열만 입력 가능합니다.')
  return send(context, 'MMS', corpNum, sender, senderName, subject, contents, messages, reserveDT, adsYN, requestNum, userId, filePath)
}
