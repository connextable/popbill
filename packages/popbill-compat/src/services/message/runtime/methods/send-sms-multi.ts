import { send } from '../common'
import type { MessageRuntimeContext } from '../context'
import type { MessageRecipient } from '../../types'

export async function requestSendSMS_multi(
  context: MessageRuntimeContext,
  corpNum: string,
  sender: string,
  contents: string,
  messages: MessageRecipient[],
  reserveDT?: string,
  adsYN?: boolean,
  requestNum?: string,
  senderName?: string,
  userId?: string
): Promise<string> {
  return send(context, 'SMS', corpNum, sender, senderName ?? '', '', contents, messages, reserveDT, adsYN, requestNum, userId)
}
