import type * as Input from './document'
import type * as Output from './response'
export type * from './document'
export type * from './response'
export interface MessageService {
  /** Compat: `getSenderNumberMgtURL` */
  getSenderNumberRegistrationURL(request: Input.MessageBusinessRequest): Promise<Output.MessageAccessURL>
  /** Compat: `getSenderNumberList` */
  getSenderNumbers(request: Input.MessageBusinessRequest): Promise<Output.MessageSenderNumber[]>
  /** Compat: `checkSenderNumber` */
  checkSenderNumber(request: Input.MessageBusinessRequest & { senderNumber: string }): Promise<Output.MessageOperationResult>
  /** Compat: `checkAutoDenyNumber` */
  getDenyNumberInfo(request: Input.MessageBusinessRequest): Promise<Output.MessageDenyNumberInfo>
  /** Compat: `getAutoDenyList` */
  getDeniedNumbers(request: Input.MessageBusinessRequest): Promise<Output.MessageDeniedNumber[]>
  /** Compat: `sendMessage` */
  sendShortMessage(request: Input.SendMessageRequest): Promise<Output.MessageReceiptResult>
  /** Compat: `sendMessage` */
  sendLongMessage(request: Input.SendMessageRequest): Promise<Output.MessageReceiptResult>
  /** Compat: `sendMessage` */
  sendAutoLengthMessage(request: Input.SendMessageRequest): Promise<Output.MessageReceiptResult>
  /** Compat: `sendMMS_multi` */
  sendImageMessage(request: Input.SendImageMessageRequest): Promise<Output.MessageReceiptResult>
  /** Compat: `cancelReserve` */
  cancelScheduledMessagesByReceiptNumber(request: Input.MessageReceiptRequest): Promise<Output.MessageOperationResult>
  /** Compat: `cancelReserveRN` */
  cancelScheduledMessagesByRequestNumber(request: Input.MessageRequestNumberRequest): Promise<Output.MessageOperationResult>
  /** Compat: `cancelReservebyRCV` */
  cancelScheduledRecipientByReceiptNumber(request: Input.MessageReceiptRecipientRequest): Promise<Output.MessageOperationResult>
  /** Compat: `cancelReserveRNbyRCV` */
  cancelScheduledRecipientByRequestNumber(request: Input.MessageRequestRecipientRequest): Promise<Output.MessageOperationResult>
  /** Compat: `getMessages` */
  getMessagesByReceiptNumber(request: Input.MessageReceiptRequest): Promise<Output.SentMessage[]>
  /** Compat: `getMessagesRN` */
  getMessagesByRequestNumber(request: Input.MessageRequestNumberRequest): Promise<Output.SentMessage[]>
  /** Compat: `search` */
  searchMessages(request: Input.MessageSearchRequest): Promise<Output.MessageSearchResult>
  /** Compat: `getSentListURL` */
  getSentMessageListURL(request: Input.MessageBusinessRequest): Promise<Output.MessageAccessURL>
  /** Compat: `getUnitCost` */
  getUnitCost(request: Input.MessageChargeRequest): Promise<Output.MessageUnitCost>
  /** Compat: `getChargeInfo` */
  getChargeInfo(request: Input.MessageChargeRequest): Promise<Output.MessageChargeInfo>
}
