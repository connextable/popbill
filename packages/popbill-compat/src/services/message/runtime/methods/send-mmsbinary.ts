import { send } from '../common'
import { createLegacyValidationError } from '@/internal/errors'
import type { MessageRuntimeContext } from '../context'
import type { MessageBinaryFile } from '../../types'

export async function requestSendMMSBinary(
  context: MessageRuntimeContext,
  corpNum: string,
  sender: string,
  receiver: string,
  receiverName: string,
  subject: string,
  contents: string,
  file: MessageBinaryFile,
  reserveDT?: string,
  adsYN?: boolean,
  requestNum?: string,
  senderName?: string,
  userId?: string
): Promise<string> {
  if (!file || typeof file !== 'object') throw createLegacyValidationError('첨부파일 정보가 입력되지 않았습니다.')
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
    file
  )
}
