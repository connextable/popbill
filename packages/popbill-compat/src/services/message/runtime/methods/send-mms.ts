import { createLegacyValidationError } from '@/internal/errors'
import { send } from '../common'
import type { MessageRuntimeContext } from '../context'

export async function requestSendMMS(
  context: MessageRuntimeContext,
  corpNum: string,
  sender: string,
  receiver: string,
  receiverName: string,
  subject: string,
  contents: string,
  filePath: string,
  reserveDT?: string,
  adsYN?: boolean,
  requestNum?: string,
  senderName?: string,
  userId?: string
): Promise<string> {
  if (typeof filePath !== 'string') throw createLegacyValidationError('첨부파일 경로는 문자열만 입력 가능합니다.')
  return send(
    context,
    'MMS',
    corpNum,
    '',
    senderName ?? '',
    '',
    '',
    { Sender: sender, Receiver: receiver, ReceiverName: receiverName, Subject: subject, Contents: contents },
    reserveDT,
    adsYN,
    requestNum,
    userId,
    filePath
  )
}
