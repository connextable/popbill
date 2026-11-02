import type * as Spec from '@connextable/popbill-spec'
import type { FaxResult, FaxSearchResult, FaxSenderNumber } from '../types'

export function mapFaxResult(result: Spec.FaxResultApiModel): FaxResult {
  return {
    receiptNumber: result.receiptNum ?? undefined,
    requestNumber: result.requestNum ?? undefined,
    partnerReferenceKey: result.interOPRefKey ?? undefined,
    senderPhoneNumber: result.sendNum ?? undefined,
    senderName: result.senderName ?? undefined,
    recipientPhoneNumber: result.receiveNum ?? undefined,
    recipientName: result.receiveName ?? undefined,
    recipientNumberType: result.receiveNumType ?? undefined,
    title: result.title ?? undefined,
    fileNames: result.fileNames === undefined || result.fileNames === null ? undefined : [...result.fileNames],
    convertedFileSize: result.tiffFileSize ?? undefined,
    stateCode: result.state,
    resultCode: result.result ?? undefined,
    sentPageCount: result.sendPageCnt ?? undefined,
    successfulPageCount: result.successPageCnt ?? undefined,
    failedPageCount: result.failPageCnt ?? undefined,
    cancelledPageCount: result.cancelPageCnt ?? undefined,
    chargedPageCount: result.chargePageCnt ?? undefined,
    refundedPageCount: result.refundPageCnt ?? undefined,
    receivedAt: result.receiptDT ?? undefined,
    scheduledAt: result.reserveDT ?? undefined,
    sentAt: result.sendDT ?? undefined,
    resultReceivedAt: result.resultDT ?? undefined,
  }
}
export function mapFaxSearchResult(result: Spec.FaxSearchResultApiModel): FaxSearchResult {
  return {
    code: result.code,
    message: result.message,
    pageNumber: result.pageNum,
    pageSize: result.perPage,
    pageCount: result.pageCount,
    totalCount: result.total,
    items: result.list.map(mapFaxResult),
  }
}
export function mapFaxSenderNumber(result: Spec.FaxSenderNumberApiModel): FaxSenderNumber {
  return { phoneNumber: result.number, isRepresentative: result.representYN, stateCode: result.state, memo: result.memo ?? undefined }
}
