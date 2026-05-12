import type { MethodDefinition } from './types.ts'
import { ATTACHMENT_METHODS } from './attachment.ts'
import { CERTIFICATE_METHODS } from './certificate.ts'
import { INQUIRY_METHODS } from './inquiry.ts'
import { ISSUE_METHODS } from './issue.ts'
import { NOTIFY_METHODS } from './notify.ts'
import { VIEW_METHODS } from './view.ts'

export const METHODS = {
  ...ISSUE_METHODS,
  ...INQUIRY_METHODS,
  ...VIEW_METHODS,
  ...ATTACHMENT_METHODS,
  ...NOTIFY_METHODS,
  ...CERTIFICATE_METHODS,
} as const satisfies Record<string, MethodDefinition>

export type MethodName = keyof typeof METHODS

export const METHOD_GROUPS = {
  issue: Object.keys(ISSUE_METHODS),
  inquiry: Object.keys(INQUIRY_METHODS),
  view: Object.keys(VIEW_METHODS),
  attachment: Object.keys(ATTACHMENT_METHODS),
  notify: Object.keys(NOTIFY_METHODS),
  certificate: Object.keys(CERTIFICATE_METHODS),
} as const

export const COMPAT_METHOD_NAME_BY_METHOD = {
  issueInvoiceImmediately: 'registIssue',
  submitBulkIssue: 'bulkSubmit',
  getBulkIssueSubmissionResult: 'getBulkResult',
  registerInvoice: 'register',
  updateInvoice: 'update',
  issueInvoice: 'issue',
  cancelIssuedInvoice: 'cancelIssue',
  requestReverseIssueImmediately: 'registRequest',
  requestReverseIssue: 'request',
  cancelReverseIssueRequest: 'cancelRequest',
  refuseReverseIssueRequest: 'refuse',
  deleteInvoice: 'delete',
  sendInvoiceToNTS: 'sendToNTS',

  getInvoiceInfo: 'getInfo',
  getInvoicesInfo: 'getInfos',
  getInvoiceDetailInfo: 'getDetailInfo',
  checkInvoiceManagementKeyInUse: 'checkMgtKeyInUse',
  getInvoiceXML: 'getXML',
  searchInvoices: 'search',
  getInvoiceLogs: 'getLogs',
  getTaxInvoiceBoxURL: 'getURL',

  getInvoicePopupURL: 'getPopUpURL',
  getInvoiceViewURL: 'getViewURL',
  getSupplierInvoicePrintURL: 'getPrintURL',
  getBuyerInvoicePrintURL: 'getEPrintURL',
  getBulkInvoicePrintURL: 'getMassPrintURL',
  getInvoiceMailURL: 'getMailURL',
  getInvoicePDFURL: 'getPDFURL',

  getSealAndAttachmentRegistrationURL: 'getSealURL',
  attachFileFromPath: 'attachFile',
  attachFileFromBinary: 'attachFileBinary',
  deleteAttachedFile: 'deleteFile',
  getAttachedFiles: 'getFiles',
  resendInvoiceEmail: 'sendEmail',
  resendInvoiceSMS: 'sendSMS',
  resendInvoiceFAX: 'sendFAX',
  attachInvoiceStatement: 'attachStatement',
  detachInvoiceStatement: 'detachStatement',
  assignInvoiceManagementKey: 'assignMgtKey',
  getEmailSendSettings: 'listEmailConfig',
  updateEmailSendSettings: 'updateEmailConfig',
  getSendToNTSSettings: 'getSendToNTSConfig',

  getTaxCertificateRegistrationURL: 'getTaxCertURL',
  getTaxCertificateExpirationDate: 'getCertificateExpireDate',
  checkTaxCertificateValidation: 'checkCertValidation',
  getTaxCertificateInfo: 'getTaxCertInfo',
} as const satisfies Record<MethodName, string>
