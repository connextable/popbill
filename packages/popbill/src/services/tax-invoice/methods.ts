import type { TaxInvoiceService } from './types'

/**
 * TaxInvoice modern facade 공개 메서드 목록입니다.
 * 문서 섹션(발행/전송, 정보확인, 보기/인쇄, 부가기능, 인증서 관리) 순서를 유지합니다.
 */
export const TAX_INVOICE_METHODS = [
  // 발행/전송
  'issueInvoiceImmediately',
  'submitBulkIssue',
  'getBulkIssueSubmissionResult',
  'registerInvoice',
  'updateInvoice',
  'issueInvoice',
  'cancelIssuedInvoice',
  'requestReverseIssueImmediately',
  'requestReverseIssue',
  'cancelReverseIssueRequest',
  'refuseReverseIssueRequest',
  'deleteInvoice',
  'sendInvoiceToNTS',

  // 정보확인
  'getInvoiceInfo',
  'getInvoicesInfo',
  'getInvoiceDetailInfo',
  'checkInvoiceManagementKeyInUse',
  'getInvoiceXML',
  'searchInvoices',
  'getInvoiceLogs',
  'getTaxInvoiceBoxURL',

  // 보기/인쇄
  'getInvoicePopupURL',
  'getInvoiceViewURL',
  'getSupplierInvoicePrintURL',
  'getBuyerInvoicePrintURL',
  'getBulkInvoicePrintURL',
  'getInvoiceMailURL',
  'getInvoicePDFURL',

  // 부가기능
  'getSealAndAttachmentRegistrationURL',
  'attachFileFromPath',
  'attachFileFromBinary',
  'deleteAttachedFile',
  'getAttachedFiles',
  'resendInvoiceEmail',
  'resendInvoiceSMS',
  'resendInvoiceFAX',
  'attachInvoiceStatement',
  'detachInvoiceStatement',
  'assignInvoiceManagementKey',
  'getEmailSendSettings',
  'updateEmailSendSettings',
  'getSendToNTSSettings',

  // 인증서 관리
  'getTaxCertificateRegistrationURL',
  'getTaxCertificateExpirationDate',
  'checkTaxCertificateValidation',
  'getTaxCertificateInfo',
] as const satisfies readonly (keyof TaxInvoiceService & string)[]
