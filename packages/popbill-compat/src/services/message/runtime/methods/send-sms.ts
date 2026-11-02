import { send } from '../common'
import type { MessageRuntimeContext } from '../context'

export async function requestSendSMS(
  context: MessageRuntimeContext,
  corpNum: string,
  sender: string,
  receiver: string,
  receiverName: string,
  contents: string,
  reserveDT?: string,
  adsYN?: boolean,
  senderName?: string,
  requestNum?: string,
  userId?: string
): Promise<string> {
  return send(
    context,
    'SMS',
    corpNum,
    '',
    '',
    '',
    '',
    { Sender: sender, SenderName: senderName, Receiver: receiver, ReceiverName: receiverName, Subject: '', Contents: contents },
    reserveDT,
    adsYN,
    requestNum,
    userId
  )
}
