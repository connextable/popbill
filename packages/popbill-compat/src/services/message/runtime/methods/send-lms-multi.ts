import { send } from '../common'
import type { MessageRuntimeContext } from '../context'
import type { MessageRecipient } from '../../types'

export async function requestSendLMS_multi(
  context: MessageRuntimeContext,
  corpNum: string,
  sender: string,
  subject: string,
  contents: string,
  messages: MessageRecipient[],
  reserveDT?: string,
  adsYN?: boolean,
  requestNum?: string,
  senderName?: string,
  userId?: string
): Promise<string> {
  return send(context, 'LMS', corpNum, sender, senderName ?? '', subject, contents, messages, reserveDT, adsYN, requestNum, userId)
}
