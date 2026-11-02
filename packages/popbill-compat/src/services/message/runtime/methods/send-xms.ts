import { send } from '../common'
import type { MessageRuntimeContext } from '../context'

export async function requestSendXMS(
  context: MessageRuntimeContext,
  corpNum: string,
  sender: string,
  receiver: string,
  receiverName: string,
  subject: string,
  contents: string,
  reserveDT?: string,
  adsYN?: boolean,
  senderName?: string,
  requestNum?: string,
  userId?: string
): Promise<string> {
  return send(
    context,
    'XMS',
    corpNum,
    '',
    '',
    '',
    '',
    { Sender: sender, SenderName: senderName, Receiver: receiver, ReceiverName: receiverName, Subject: subject, Contents: contents },
    reserveDT,
    adsYN,
    requestNum,
    userId
  )
}
