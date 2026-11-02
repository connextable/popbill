import { send } from '../common'
import type { MessageRuntimeContext } from '../context'
import type { MessageRecipient } from '../../types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSendMessage(
  context: MessageRuntimeContext,
  messageType: Spec.MessageSendType,
  corpNum: string,
  sender: string,
  senderName: string,
  subject: string,
  contents: string,
  messages: MessageRecipient | MessageRecipient[],
  reserveDT?: string,
  adsYN?: boolean,
  requestNum?: string,
  userId?: string
): Promise<string> {
  return send(context, messageType, corpNum, sender, senderName, subject, contents, messages, reserveDT, adsYN, requestNum, userId)
}
