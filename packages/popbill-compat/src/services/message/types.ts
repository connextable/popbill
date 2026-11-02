import type * as Spec from '@connextable/popbill-spec'

export interface MessageRecipient {
  Receiver: string
  ReceiverName?: string
  Sender?: string
  SenderName?: string
  Subject?: string
  Contents?: string
  Content?: string
  interOPRefKey?: string
}
export interface MessageBinaryFile {
  fileName: string
  fileData: Buffer
}
export interface MessagePromiseService {
  getSenderNumberMgtURL(corpNum: string, userId?: string): Promise<string>
  getSenderNumberList(corpNum: string, userId?: string): Promise<Spec.MessageSenderNumberApiModel[]>
  checkSenderNumber(corpNum: string, senderNumber: string, userId?: string): Promise<Spec.MessageApiResponseBase>
  checkAutoDenyNumber(corpNum: string, userId?: string): Promise<Spec.MessageAutoDenyNumberApiResponse>
  getAutoDenyList(corpNum: string, userId?: string): Promise<Spec.MessageAutoDenyApiModel[]>
  sendSMS(
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
  ): Promise<string>
  sendSMS_multi(
    corpNum: string,
    sender: string,
    contents: string,
    messages: MessageRecipient[],
    reserveDT?: string,
    adsYN?: boolean,
    requestNum?: string,
    senderName?: string,
    userId?: string
  ): Promise<string>
  sendLMS(
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
  ): Promise<string>
  sendLMS_multi(
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
  ): Promise<string>
  sendXMS(
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
  ): Promise<string>
  sendXMS_multi(
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
  ): Promise<string>
  sendMMS(
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
  ): Promise<string>
  sendMMS_multi(
    corpNum: string,
    sender: string,
    subject: string,
    contents: string,
    messages: MessageRecipient[],
    filePath: string,
    reserveDT?: string,
    adsYN?: boolean,
    requestNum?: string,
    senderName?: string,
    userId?: string
  ): Promise<string>
  sendMMSBinary(
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
  ): Promise<string>
  sendMMSBinary_multi(
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
  ): Promise<string>
  sendMessage(
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
  ): Promise<string>
  sendMessage_MMS(
    corpNum: string,
    sender: string,
    senderName: string,
    subject: string,
    contents: string,
    messages: MessageRecipient | MessageRecipient[],
    filePath: string,
    reserveDT?: string,
    adsYN?: boolean,
    requestNum?: string,
    userId?: string
  ): Promise<string>
  cancelReserve(corpNum: string, receiptNum: string, userId?: string): Promise<Spec.MessageApiResponseBase>
  cancelReserveRN(corpNum: string, requestNum: string, userId?: string): Promise<Spec.MessageApiResponseBase>
  cancelReservebyRCV(corpNum: string, receiptNum: string, receiveNum: string, userId?: string): Promise<Spec.MessageApiResponseBase>
  cancelReserveRNbyRCV(corpNum: string, requestNum: string, receiveNum: string, userId?: string): Promise<Spec.MessageApiResponseBase>
  getMessages(corpNum: string, receiptNum: string, userId?: string): Promise<Spec.MessageSentApiModel[]>
  getMessagesRN(corpNum: string, requestNum: string, userId?: string): Promise<Spec.MessageSentApiModel[]>
  getStates(corpNum: string, receiptNumList: string[], userId?: string): Promise<Spec.MessageReceiptStateApiModel[]>
  search(
    corpNum: string,
    startDate: string,
    endDate: string,
    state: string[],
    item?: Spec.MessageType[],
    reserveYN?: boolean,
    senderYN?: boolean,
    order?: string,
    page?: number,
    perPage?: number,
    qString?: string,
    userId?: string
  ): Promise<Spec.MessageSearchApiResponse>
  getURL(corpNum: string, togo: string, userId?: string): Promise<string>
  getSentListURL(corpNum: string, userId?: string): Promise<string>
  getUnitCost(corpNum: string, messageType: Spec.MessageType): Promise<string>
  getChargeInfo(corpNum: string, messageType: Spec.MessageType, userId?: string): Promise<Spec.MessageChargeInfoApiResponse>
}
type Success<T> = (response: T) => void
type Failure = (error: unknown) => void
type ExplicitArgs<T extends unknown[]> = { [K in keyof T]-?: [T[K]] } extends infer Boxes extends unknown[]
  ? { [K in keyof Boxes]: Boxes[K] extends [infer Value] ? Value : never }
  : never
type DefinedTail<T extends unknown[]> = ExplicitArgs<T> extends [...infer Rest, infer Last] ? [...Rest, Exclude<Last, undefined>] : []
interface LegacyCallback<T extends unknown[], R> {
  (...args: T): void
  (...args: [...DefinedTail<T>, success: Success<R> | undefined, error?: Failure]): void
  (...args: [...T, success: Success<R> | undefined, error: Failure | undefined]): void
}
type CallbackMethod<T extends unknown[], R> =
  T extends Required<T> ? LegacyCallback<T, R> : T extends [...infer Rest, unknown?] ? LegacyCallback<T, R> & CallbackMethod<Rest, R> : never
export type MessageCallbackService = {
  [K in keyof MessagePromiseService]: CallbackMethod<Parameters<MessagePromiseService[K]>, Awaited<ReturnType<MessagePromiseService[K]>>>
}
