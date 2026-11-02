import type { FaxApiResponseBase, FaxReceiveNumberType } from './common'

/** Raw multipart form JSON. A separate `file` part is sent for each file. */
export interface FaxSendApiModel {
  requestNum?: string
  snd: string
  sndnm?: string
  rcvs: FaxReceiverApiModel[]
  fCnt: number
  title?: string
  adsYN?: boolean
  sndDT?: string
}
export interface FaxReceiverApiModel {
  rcv: string
  rcvnm?: string
  interOPRefKey?: string
}
export interface FaxBinaryFileApiModel {
  fileName: string
  fileData: Uint8Array
}
export interface FaxResendApiModel {
  requestNum?: string
  snd?: string
  sndnm?: string
  rcvs?: FaxReceiverApiModel[]
  title?: string
  sndDT?: string
}
/** State and result codes remain numbers to preserve future provider codes. */
export interface FaxResultApiModel {
  receiptNum?: string | null
  requestNum?: string | null
  interOPRefKey?: string | null
  sendNum?: string | null
  senderName?: string | null
  receiveNum?: string | null
  receiveName?: string | null
  receiveNumType?: FaxReceiveNumberType | null
  title?: string | null
  fileNames?: string[] | null
  tiffFileSize?: string | null
  state: number
  result?: number | null
  sendPageCnt?: number | null
  successPageCnt?: number | null
  failPageCnt?: number | null
  cancelPageCnt?: number | null
  chargePageCnt?: number | null
  refundPageCnt?: number | null
  receiptDT?: string | null
  reserveDT?: string | null
  sendDT?: string | null
  resultDT?: string | null
}
export interface FaxSenderNumberApiModel {
  number: string
  representYN: boolean
  state: number
  memo?: string | null
}
export interface FaxSearchResultApiModel extends FaxApiResponseBase {
  pageNum: number
  perPage: number
  pageCount: number
  total: number
  list: FaxResultApiModel[]
}
export interface FaxChargeInfoApiModel {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
