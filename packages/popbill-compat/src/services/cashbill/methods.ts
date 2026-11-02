import type { CashbillPromiseService } from './types'

export const CASHBILL_METHODS = [
  // 발행/취소
  'registIssue',
  'revokeRegistIssue',
  'bulkSubmit',
  'getBulkResult',
  'register',
  'revokeRegister',
  'update',
  'issue',
  'cancelIssue',
  'delete',
  // 정보확인
  'getInfo',
  'getInfos',
  'getDetailInfo',
  'checkMgtKeyInUse',
  'search',
  'getLogs',
  'getURL',
  // 보기/인쇄
  'getPopUpURL',
  'getViewURL',
  'getPrintURL',
  'getEPrintURL',
  'getMassPrintURL',
  'getMailURL',
  'getPDFURL',
  'getPDF',
  // 부가기능
  'sendEmail',
  'sendSMS',
  'sendFAX',
  'assignMgtKey',
  'listEmailConfig',
  'updateEmailConfig',
  // 과금정보
  'getChargeInfo',
  'getUnitCost',
] as const satisfies readonly (keyof CashbillPromiseService)[]
