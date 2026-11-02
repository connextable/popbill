import type { MessageRecipient } from '@connextable/popbill-compat/factory'
import type { MessageRecipientInput } from '../types'
export function mapMessageRecipient(input: MessageRecipientInput): MessageRecipient {
  return {
    Receiver: input.receiverNumber,
    ReceiverName: input.receiverName,
    Sender: input.senderNumber,
    SenderName: input.senderName,
    Subject: input.subject,
    Contents: input.body,
    interOPRefKey: input.referenceKey,
  }
}
