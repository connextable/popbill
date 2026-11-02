import type { KakaoService } from './types'
export const KAKAO_METHODS = [
  // 채널관리
  'getBusinessChannelManagementURL',
  'listBusinessChannels',
  // 발신번호
  'getSenderNumberManagementURL',
  'listSenderNumbers',
  'checkSenderNumberRegistration',
  // 템플릿관리
  'getNotificationTemplateManagementURL',
  'getNotificationTemplate',
  'listNotificationTemplates',
  'getBrandTemplateManagementURL',
  'getBrandTemplate',
  'listBrandTemplates',
  // 이미지관리
  'uploadBrandImageFromPath',
  'uploadBrandImageFromBinary',
  'uploadBrandWideImageFromPath',
  'uploadBrandWideImageFromBinary',
  'uploadBrandWideListMainImageFromPath',
  'uploadBrandWideListMainImageFromBinary',
  'uploadBrandWideListImageFromPath',
  'uploadBrandWideListImageFromBinary',
  'uploadBrandCarouselFeedImageFromPath',
  'uploadBrandCarouselFeedImageFromBinary',
  'uploadBrandCommerceImageFromPath',
  'uploadBrandCommerceImageFromBinary',
  'uploadBrandCarouselCommerceImageFromPath',
  'uploadBrandCarouselCommerceImageFromBinary',
  // 메시지 전송
  'sendNotificationMessage',
  'sendNotificationMessages',
  'sendIdenticalNotificationMessages',
  'sendBrandTextMessages',
  'sendBrandImageMessages',
  'sendBrandWideImageMessages',
  'sendBrandWideListMessages',
  'sendBrandCarouselFeedMessages',
  'sendBrandCommerceMessages',
  'sendBrandCarouselCommerceMessages',
  'sendBrandTemplateMessages',
  // 예약취소
  'cancelReservedMessagesByReceiptNumber',
  'cancelReservedMessagesByRequestNumber',
  'cancelReservedRecipientByReceiptNumber',
  'cancelReservedRecipientByRequestNumber',
  // 결과조회
  'getMessagesByReceiptNumber',
  'getMessagesByRequestNumber',
  'searchMessages',
  'getMessageHistoryURL',
  // 과금정보
  'getMessageUnitCost',
  'getMessageChargeInfo',
] as const satisfies readonly (keyof KakaoService)[]
