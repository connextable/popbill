import type { TaxinvoiceCallbackService } from './types'

export const TAXINVOICE_METHODS = [
  // 발행/전송
  'registIssue',
  'bulkSubmit',
  'getBulkResult',
  'register',
  'update',
  'issue',
  'cancelIssue',
  'registRequest',
  'request',
  'cancelRequest',
  'refuse',
  'delete',
  'sendToNTS',

  // 정보확인
  'getInfo',
  'getInfos',
  'getDetailInfo',
  'checkMgtKeyInUse',
  'getXML',
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

  // 부가기능
  'getSealURL',
  'attachFile',
  'attachFileBinary',
  'deleteFile',
  'getFiles',
  'sendEmail',
  'sendSMS',
  'sendFAX',
  'attachStatement',
  'detachStatement',
  'assignMgtKey',
  'listEmailConfig',
  'updateEmailConfig',
  'getSendToNTSConfig',

  // 인증서 관리
  'getTaxCertURL',
  'getCertificateExpireDate',
  'checkCertValidation',
  'getTaxCertInfo',

  // 기타(legacy 호환)
  'getChargeInfo',
  'getUnitCost',
  'send',
  'cancelSend',
  'accept',
  'deny',
  'getOldPrintURL',
  'getEmailPublicKeys',
  'getPDF',
] as const satisfies readonly (keyof TaxinvoiceCallbackService & string)[]

export const TAXINVOICE_REQUIRED_METHODS = [
  // 발행/전송
  'registIssue',
  'bulkSubmit',
  'getBulkResult',
  'register',
  'update',
  'issue',
  'cancelIssue',
  'registRequest',
  'request',
  'cancelRequest',
  'refuse',
  'delete',
  'sendToNTS',

  // 정보확인
  'getInfo',
  'getInfos',
  'getDetailInfo',
  'checkMgtKeyInUse',
  'getXML',
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

  // 부가기능
  'getSealURL',
  'attachFile',
  'attachFileBinary',
  'deleteFile',
  'getFiles',
  'sendEmail',
  'sendSMS',
  'sendFAX',
  'attachStatement',
  'detachStatement',
  'assignMgtKey',
  'listEmailConfig',
  'updateEmailConfig',
  'getSendToNTSConfig',

  // 인증서 관리
  'getTaxCertURL',
  'getCertificateExpireDate',
  'checkCertValidation',
  'getTaxCertInfo',
] as const satisfies readonly (keyof TaxinvoiceCallbackService & string)[]
