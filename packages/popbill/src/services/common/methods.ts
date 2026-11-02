import type { CommonService } from './types'
export const COMMON_METHODS = [
  // 회원관리
  'checkMemberRegistration',
  'checkUserIdUsage',
  'registerMember',
  'quitMember',
  // 기업정보
  'getCompanyInfo',
  'updateCompanyInfo',
  // 담당자관리
  'registerContact',
  'getContactInfo',
  'listContacts',
  'updateContact',
  'deleteContact',
  // 접근 URL
  'getLoginURL',
  // 포인트
  'getMemberPointBalance',
  'getPartnerPointBalance',
  'getMemberPointChargeURL',
  'getPartnerPointChargeURL',
  // 결제
  'requestPointPayment',
  'getPointPaymentInfo',
  'getPointPaymentHistory',
  'getPointPaymentHistoryURL',
  // 사용내역
  'getPointUseHistory',
  'getPointUseHistoryURL',
  // 환불
  'getRefundablePointBalance',
  'requestPointRefund',
  'getPointRefundInfo',
  'getPointRefundHistory',
] as const satisfies readonly (keyof CommonService)[]
