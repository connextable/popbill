import type { FaxService } from './types'

export const FAX_METHODS = [
  // 발신번호
  'getFaxSenderRegistrationURL',
  'getSenderNumbers',
  'checkSenderNumber',
  // 팩스 전송
  'sendFaxFromPaths',
  'sendFaxFromBinary',
  'resendFaxByReceipt',
  'resendFaxByRequest',
  // 예약취소
  'cancelScheduledFaxByReceipt',
  'cancelScheduledFaxByRequest',
  // 결과조회
  'getFaxResultsByReceipt',
  'getFaxResultsByRequest',
  'searchFaxes',
  'getSentFaxListURL',
  'getFaxPreviewURL',
  // 과금정보
  'getUnitCost',
  'getChargeInfo',
] as const satisfies readonly (keyof FaxService)[]
