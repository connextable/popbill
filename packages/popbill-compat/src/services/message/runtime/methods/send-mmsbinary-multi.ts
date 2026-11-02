import { send } from '../common'
import { createLegacyValidationError } from '@/internal/errors'
import type { MessageRuntimeContext } from '../context'
import type { MessageRecipient, MessageBinaryFile } from '../../types'

export async function requestSendMMSBinary_multi(
  context: MessageRuntimeContext,
  corpNum: string,
  sender: string,
  subject: string,
  contents: string,
  messages: MessageRecipient[],
  file: MessageBinaryFile,
  reserveDT?: string,
  adsYN?: boolean,
  requestNum?: string,
  senderName?: string,
  userId?: string
): Promise<string> {
  if (!file || typeof file !== 'object') throw createLegacyValidationError('첨부파일 정보가 입력되지 않았습니다.')
  return send(context, 'MMS', corpNum, sender, senderName ?? '', subject, contents, messages, reserveDT, adsYN, requestNum, userId, file)
}
