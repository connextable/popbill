import type { StatementPromiseService } from './types'

export const STATEMENT_METHODS = [
  // 발행/취소
  'registIssue',
  'register',
  'update',
  'issue',
  'cancel',
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
  // 부가기능
  'getSealURL',
  'attachFile',
  'attachFileBinary',
  'deleteFile',
  'getFiles',
  'sendEmail',
  'sendSMS',
  'sendFAX',
  'FAXSend',
  'attachStatement',
  'detachStatement',
  'listEmailConfig',
  'updateEmailConfig',
  // 과금정보
  'getChargeInfo',
  'getUnitCost',
] as const satisfies readonly (keyof StatementPromiseService)[]

export const STATEMENT_REQUIRED_METHODS = STATEMENT_METHODS
