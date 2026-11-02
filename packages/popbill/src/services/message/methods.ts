import type { MessageService } from './types'
export const MESSAGE_METHODS = [
  // 발신번호/수신거부
  'getSenderNumberRegistrationURL',
  'getSenderNumbers',
  'checkSenderNumber',
  'getDenyNumberInfo',
  'getDeniedNumbers',
  // 메시지 전송
  'sendShortMessage',
  'sendLongMessage',
  'sendAutoLengthMessage',
  'sendImageMessage',
  // 예약취소
  'cancelScheduledMessagesByReceiptNumber',
  'cancelScheduledMessagesByRequestNumber',
  'cancelScheduledRecipientByReceiptNumber',
  'cancelScheduledRecipientByRequestNumber',
  // 결과조회
  'getMessagesByReceiptNumber',
  'getMessagesByRequestNumber',
  'searchMessages',
  'getSentMessageListURL',
  // 과금정보
  'getUnitCost',
  'getChargeInfo',
] as const satisfies readonly (keyof MessageService)[]
