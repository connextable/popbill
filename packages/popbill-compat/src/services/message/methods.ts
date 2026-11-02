import type { MessagePromiseService } from './types'
export const MESSAGE_METHODS = [
  // 발신번호/수신거부
  'getSenderNumberMgtURL',
  'getSenderNumberList',
  'checkSenderNumber',
  'checkAutoDenyNumber',
  'getAutoDenyList',
  // 메시지 전송
  'sendSMS',
  'sendSMS_multi',
  'sendLMS',
  'sendLMS_multi',
  'sendXMS',
  'sendXMS_multi',
  'sendMMS',
  'sendMMS_multi',
  'sendMMSBinary',
  'sendMMSBinary_multi',
  'sendMessage',
  'sendMessage_MMS',
  // 예약취소
  'cancelReserve',
  'cancelReserveRN',
  'cancelReservebyRCV',
  'cancelReserveRNbyRCV',
  // 결과조회
  'getMessages',
  'getMessagesRN',
  'getStates',
  'search',
  'getURL',
  'getSentListURL',
  // 과금정보
  'getUnitCost',
  'getChargeInfo',
] as const satisfies readonly (keyof MessagePromiseService)[]
