import type * as Spec from '@connextable/popbill-spec'
import { preserveStringCode } from '@connextable/popbill-utils'
import type * as Types from '../types'
export function mapSentMessage(raw: Spec.MessageSentApiModel): Types.SentMessage {
  return {
    receiptNumber: raw.receiptNum,
    requestNumber: raw.requestNum,
    referenceKey: raw.interOPRefKey,
    messageType: raw.type,
    senderNumber: raw.sendNum,
    senderName: raw.senderName,
    receiverNumber: raw.receiveNum,
    receiverName: raw.receiveName,
    subject: raw.subject,
    body: raw.content,
    carrierName: raw.tranNet,
    stateCode: preserveStringCode(raw.state),
    resultCode: preserveStringCode(raw.result),
    receivedAt: raw.receiptDT,
    reservedAt: raw.reserveDT,
    sentAt: raw.sendDT,
    resultReceivedAt: raw.resultDT,
  }
}
export function mapMessageSearch(raw: Spec.MessageSearchApiResponse): Types.MessageSearchResult {
  return {
    code: raw.code,
    message: raw.message,
    pageNumber: raw.pageNum,
    pageSize: raw.perPage,
    pageCount: raw.pageCount,
    totalCount: raw.total,
    items: raw.list.map(mapSentMessage),
  }
}
