import type { MessageApiResponseBase, MessageType } from './common'

/** HTTP request recipient; per-recipient fields override shared send fields. */
export interface MessageRecipientApiModel {
  rcv: string
  rcvnm?: string
  snd?: string
  sndnm?: string
  sjt?: string
  msg?: string
  interOPRefKey?: string
}
export interface MessageSendApiBody {
  requestNum?: string
  snd?: string
  sndnm?: string
  msgs: MessageRecipientApiModel[]
  subject?: string
  content?: string
  adsYN?: boolean
  sndDT?: string
}
/** MMS multipart: JSON in form, one JPEG image in file. */
export interface MessageMmsApiBody {
  form: MessageSendApiBody
  file: { fileName: string; fileData: Uint8Array }
}
export interface MessageSentApiModel {
  receiptNum?: string
  requestNum?: string
  interOPRefKey?: string
  type?: MessageType
  sendNum?: string
  senderName?: string
  receiveNum?: string
  receiveName?: string
  subject?: string
  content?: string
  tranNet?: string
  /** HTTP docs use numbers; Node docs and older responses also use strings. */
  state?: number | string
  result?: number | string
  receiptDT?: string
  reserveDT?: string
  sendDT?: string
  resultDT?: string
}
export interface MessageSearchResultApiModel extends MessageApiResponseBase {
  pageNum: number
  perPage: number
  pageCount: number
  total: number
  list: MessageSentApiModel[]
}
export interface MessageSenderNumberApiModel {
  number: string
  representYN?: boolean
  state?: number
  memo?: string | null
}
export interface MessageAutoDenyApiModel {
  number: string
  regDT?: string
}
export interface MessageAutoDenyNumberApiResponse {
  smsdenyNumber?: string
  regDT?: string
}
export interface MessageChargeInfoApiResponse {
  unitCost?: string
  chargeMethod?: '연동' | '파트너'
  rateSystem?: string
}
/** Legacy States endpoint is absent from the current published API reference. Preserve provider fields. */
export interface MessageReceiptStateApiModel {
  receiptNum?: string
  state?: string | number
  [key: string]: unknown
}
