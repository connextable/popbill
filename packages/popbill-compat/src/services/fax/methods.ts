import type { FaxPromiseService } from './types'

export const FAX_METHODS = [
  // 발신번호
  'getSenderNumberMgtURL',
  'getSenderNumberList',
  'checkSenderNumber',
  // 팩스 전송
  'sendFax',
  'sendFaxBinary',
  'resendFax',
  'resendFaxRN',
  // 예약취소
  'cancelReserve',
  'cancelReserveRN',
  // 결과조회
  'getFaxResult',
  'getFaxResultRN',
  'search',
  'getURL',
  'getSentListURL',
  'getPreviewURL',
  // 과금정보
  'getUnitCost',
  'getChargeInfo',
] as const satisfies readonly (keyof FaxPromiseService)[]
