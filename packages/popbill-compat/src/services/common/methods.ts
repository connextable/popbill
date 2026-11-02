export const COMMON_METHODS = [
  // 회원관리
  'checkIsMember',
  'checkID',
  'joinMember',
  'quitMember',
  // 기업정보
  'getCorpInfo',
  'updateCorpInfo',
  // 담당자관리
  'registContact',
  'getContactInfo',
  'listContact',
  'updateContact',
  'deleteContact',
  // 접근 URL
  'getAccessURL',
  'getPopbillURL',
  // 포인트
  'getBalance',
  'getPartnerBalance',
  'getChargeURL',
  'getPartnerURL',
  // 결제
  'paymentRequest',
  'getSettleResult',
  'getPaymentHistory',
  'getPaymentURL',
  // 사용내역
  'getUseHistory',
  'getUseHistoryURL',
  // 환불
  'getRefundableBalance',
  'refund',
  'getRefundInfo',
  'getRefundHistory',
] as const
