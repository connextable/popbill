/* eslint-disable @typescript-eslint/unified-signatures */

import type {
  TaxInvoiceApiModel,
  TaxInvoiceApiResponseBase,
  TaxInvoiceBulkSubmitApiResponse,
  TaxInvoiceGetBulkResultApiResponse,
  TaxInvoiceGetDetailInfoApiResponse,
  TaxInvoiceGetFilesApiResponse,
  TaxInvoiceGetInfoApiResponse,
  TaxInvoiceGetInfosApiResponse,
  TaxInvoiceGetLogsApiResponse,
  TaxInvoiceGetSealUrlApiResponse,
  TaxInvoiceGetSendToNTSConfigApiResponse,
  TaxInvoiceGetTaxCertInfoApiResponse,
  TaxInvoiceGetTaxCertUrlApiResponse,
  TaxInvoiceGetUrlTogo,
  TaxInvoiceGetXmlApiResponse,
  TaxInvoiceIssueApiResponse,
  TaxInvoiceListEmailConfigApiResponse,
  TaxInvoiceMgtKeyType,
  TaxInvoiceRegistIssueApiResponse,
  TaxInvoiceSearchApiResponse,
} from '@connextable/popbill-spec'
import type { CallbackService } from '@/adapters/callback-adapter'
import type { PromiseService } from '@/adapters/promise-adapter'

export type LegacySuccessCallback<T> = (response: T) => void

export type LegacyErrorCallback = (error: unknown) => void

interface LegacyCallbackWithUserId<TArgs extends unknown[], TResult> {
  (...args: TArgs): void
  (...args: [...TArgs, success: LegacySuccessCallback<TResult>, error?: LegacyErrorCallback]): void
  (...args: [...TArgs, userId: string, success: LegacySuccessCallback<TResult>, error?: LegacyErrorCallback]): void
}

interface LegacySendCallback {
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, success: LegacySuccessCallback<TaxInvoiceApiResponseBase>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId: string, success: LegacySuccessCallback<TaxInvoiceApiResponseBase>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, emailSubject: string, success: LegacySuccessCallback<TaxInvoiceApiResponseBase>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, emailSubject: string, userId: string, success: LegacySuccessCallback<TaxInvoiceApiResponseBase>, error?: LegacyErrorCallback): void
}

interface LegacyIssueCallback {
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId: string, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId: string, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, forceIssue: boolean, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, forceIssue: boolean, userId: string, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, emailSubject: string, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, emailSubject: string, userId: string, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, emailSubject: string, forceIssue: boolean, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, emailSubject: string, forceIssue: boolean, userId: string, success: LegacySuccessCallback<TaxInvoiceIssueApiResponse>, error?: LegacyErrorCallback): void
}

interface LegacySearchCallback {
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, dType: string, startDate: string, endDate: string, state: string[], type: string[], taxType: string[], lateOnly: boolean | null, order: string, page: number, perPage: number): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, dType: string, startDate: string, endDate: string, state: string[], type: string[], taxType: string[], lateOnly: boolean | null, order: string, page: number, perPage: number, success: LegacySuccessCallback<TaxInvoiceSearchApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, keyType: TaxInvoiceMgtKeyType, dType: string, startDate: string, endDate: string, state: string[], type: string[], taxType: string[], lateOnly: boolean | null, order: string, page: number, perPage: number, taxRegIDType?: string, taxRegIDYN?: string, taxRegID?: string, qString?: string, interOPYN?: string, userId?: string, issueType?: string[], regType?: string[], closeDownState?: (0 | 1 | 2 | 3 | 4)[], mgtKey?: string, success?: LegacySuccessCallback<TaxInvoiceSearchApiResponse>, error?: LegacyErrorCallback): void
}

interface LegacyRegistIssueCallback {
  (corpNum: string, taxinvoice: TaxInvoiceApiModel): void
  (corpNum: string, taxinvoice: TaxInvoiceApiModel, success: LegacySuccessCallback<TaxInvoiceRegistIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, taxinvoice: TaxInvoiceApiModel, userId: string, success: LegacySuccessCallback<TaxInvoiceRegistIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, taxinvoice: TaxInvoiceApiModel, writeSpecification?: boolean, forceIssue?: boolean, memo?: string, emailSubject?: string, dealInvoiceMgtKey?: string, success?: LegacySuccessCallback<TaxInvoiceRegistIssueApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, taxinvoice: TaxInvoiceApiModel, writeSpecification: boolean, forceIssue: boolean, memo: string, emailSubject: string, dealInvoiceMgtKey: string, userId: string, success?: LegacySuccessCallback<TaxInvoiceRegistIssueApiResponse>, error?: LegacyErrorCallback): void
}

interface LegacyBulkSubmitCallback {
  (corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[]): void
  (corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], success: LegacySuccessCallback<TaxInvoiceBulkSubmitApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], userId: string, success: LegacySuccessCallback<TaxInvoiceBulkSubmitApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], forceIssue?: boolean, success?: LegacySuccessCallback<TaxInvoiceBulkSubmitApiResponse>, error?: LegacyErrorCallback): void
  (corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], forceIssue: boolean, userId: string, success?: LegacySuccessCallback<TaxInvoiceBulkSubmitApiResponse>, error?: LegacyErrorCallback): void
}

/**
 * Callback 기반 legacy TaxinvoiceService 인터페이스.
 */
export interface TaxinvoiceCallbackService extends CallbackService {
  // 발행/전송
  registIssue: LegacyRegistIssueCallback
  bulkSubmit: LegacyBulkSubmitCallback
  getBulkResult: LegacyCallbackWithUserId<[corpNum: string, submitID: string], TaxInvoiceGetBulkResultApiResponse>
  register: LegacyCallbackWithUserId<[corpNum: string, taxinvoice: TaxInvoiceApiModel], TaxInvoiceApiResponseBase>
  update: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, taxinvoice: TaxInvoiceApiModel], TaxInvoiceApiResponseBase>
  issue: LegacyIssueCallback
  cancelIssue: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string], TaxInvoiceApiResponseBase>
  registRequest: LegacyCallbackWithUserId<[corpNum: string, taxinvoice: TaxInvoiceApiModel, memo: string], TaxInvoiceApiResponseBase>
  request: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string], TaxInvoiceApiResponseBase>
  cancelRequest: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string], TaxInvoiceApiResponseBase>
  refuse: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string], TaxInvoiceApiResponseBase>
  delete: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], TaxInvoiceApiResponseBase>
  sendToNTS: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], TaxInvoiceApiResponseBase>

  // 정보확인
  getInfo: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], TaxInvoiceGetInfoApiResponse>
  getInfos: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[]], TaxInvoiceGetInfosApiResponse>
  getDetailInfo: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], TaxInvoiceGetDetailInfoApiResponse>
  checkMgtKeyInUse: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], boolean>
  getXML: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], TaxInvoiceGetXmlApiResponse>
  search: LegacySearchCallback
  getLogs: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], TaxInvoiceGetLogsApiResponse>
  getURL: LegacyCallbackWithUserId<[corpNum: string, togo: TaxInvoiceGetUrlTogo], string>

  // 보기/인쇄
  getPopUpURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], string>
  getViewURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], string>
  getPrintURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], string>
  getEPrintURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], string>
  getMassPrintURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[]], string>
  getMailURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], string>
  getPDFURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], string>

  // 부가기능
  getSealURL: LegacyCallbackWithUserId<[corpNum: string], TaxInvoiceGetSealUrlApiResponse>
  attachFile: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, displayName: string, filePath: string], TaxInvoiceApiResponseBase>
  attachFileBinary: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, binaryFile: { fileName: string, fileData: Buffer }], TaxInvoiceApiResponseBase>
  deleteFile: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, fileID: string], TaxInvoiceApiResponseBase>
  getFiles: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], TaxInvoiceGetFilesApiResponse>
  sendEmail: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, receiver: string], TaxInvoiceApiResponseBase>
  sendSMS: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, contents: string], TaxInvoiceApiResponseBase>
  sendFAX: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string], TaxInvoiceApiResponseBase>
  attachStatement: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string], TaxInvoiceApiResponseBase>
  detachStatement: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string], TaxInvoiceApiResponseBase>
  assignMgtKey: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, itemKey: string, mgtKey: string], TaxInvoiceApiResponseBase>
  listEmailConfig: LegacyCallbackWithUserId<[corpNum: string], TaxInvoiceListEmailConfigApiResponse>
  updateEmailConfig: LegacyCallbackWithUserId<[corpNum: string, emailType: string, sendYN: boolean], TaxInvoiceApiResponseBase>
  getSendToNTSConfig: LegacyCallbackWithUserId<[corpNum: string], TaxInvoiceGetSendToNTSConfigApiResponse>

  // 인증서 관리
  getTaxCertURL: LegacyCallbackWithUserId<[corpNum: string], TaxInvoiceGetTaxCertUrlApiResponse>
  getCertificateExpireDate: LegacyCallbackWithUserId<[corpNum: string], string>
  checkCertValidation: LegacyCallbackWithUserId<[corpNum: string], TaxInvoiceApiResponseBase>
  getTaxCertInfo: LegacyCallbackWithUserId<[corpNum: string], TaxInvoiceGetTaxCertInfoApiResponse>

  // 기타(legacy 호환)
  getChargeInfo: LegacyCallbackWithUserId<[corpNum: string], TaxInvoiceApiResponseBase>
  getUnitCost: LegacyCallbackWithUserId<[corpNum: string], number>
  send: LegacySendCallback
  cancelSend: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string], TaxInvoiceApiResponseBase>
  accept: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string], TaxInvoiceApiResponseBase>
  deny: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string], TaxInvoiceApiResponseBase>
  getOldPrintURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], string>
  getEmailPublicKeys: LegacyCallbackWithUserId<[corpNum: string], TaxInvoiceApiResponseBase>
  getPDF: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string], Buffer>
}

/**
 * Promise 기반 legacy TaxinvoiceService 인터페이스.
 */
export interface TaxinvoicePromiseService extends PromiseService {
  // 발행/전송
  registIssue(corpNum: string, taxinvoice: TaxInvoiceApiModel, writeSpecification?: boolean, forceIssue?: boolean, memo?: string, emailSubject?: string, dealInvoiceMgtKey?: string, userId?: string): Promise<TaxInvoiceRegistIssueApiResponse>
  bulkSubmit(corpNum: string, submitID: string, taxinvoiceList: TaxInvoiceApiModel[], forceIssue?: boolean, userId?: string): Promise<TaxInvoiceBulkSubmitApiResponse>
  getBulkResult(corpNum: string, submitID: string, userId?: string): Promise<TaxInvoiceGetBulkResultApiResponse>
  register(corpNum: string, taxinvoice: TaxInvoiceApiModel, userId?: string): Promise<TaxInvoiceApiResponseBase>
  update(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, taxinvoice: TaxInvoiceApiModel, userId?: string): Promise<TaxInvoiceApiResponseBase>
  issue(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, emailSubject?: string, forceIssue?: boolean, userId?: string): Promise<TaxInvoiceIssueApiResponse>
  cancelIssue(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  registRequest(corpNum: string, taxinvoice: TaxInvoiceApiModel, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  request(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  cancelRequest(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  refuse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  delete(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  sendToNTS(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>

  // 정보확인
  getInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetInfoApiResponse>
  getInfos(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string): Promise<TaxInvoiceGetInfosApiResponse>
  getDetailInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetDetailInfoApiResponse>
  checkMgtKeyInUse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<boolean>
  getXML(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetXmlApiResponse>
  search(corpNum: string, keyType: TaxInvoiceMgtKeyType, dType: string, startDate: string, endDate: string, state: string[], type: string[], taxType: string[], lateOnly: boolean | null, order: string, page: number, perPage: number, taxRegIDType?: string, taxRegIDYN?: string, taxRegID?: string, qString?: string, interOPYN?: string, userId?: string, issueType?: string[], regType?: string[], closeDownState?: (0 | 1 | 2 | 3 | 4)[], mgtKey?: string): Promise<TaxInvoiceSearchApiResponse>
  getLogs(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetLogsApiResponse>
  getURL(corpNum: string, togo: TaxInvoiceGetUrlTogo, userId?: string): Promise<string>

  // 보기/인쇄
  getPopUpURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getViewURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getEPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getMassPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string): Promise<string>
  getMailURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getPDFURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>

  // 부가기능
  getSealURL(corpNum: string, userId?: string): Promise<TaxInvoiceGetSealUrlApiResponse>
  attachFile(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, displayName: string, filePath: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  attachFileBinary(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, binaryFile: { fileName: string, fileData: Buffer }, userId?: string): Promise<TaxInvoiceApiResponseBase>
  deleteFile(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, fileID: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getFiles(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetFilesApiResponse>
  sendEmail(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, receiver: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  sendSMS(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, contents: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  sendFAX(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, sender: string, receiver: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  attachStatement(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  detachStatement(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, subItemCode: number, subMgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  assignMgtKey(corpNum: string, keyType: TaxInvoiceMgtKeyType, itemKey: string, mgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  listEmailConfig(corpNum: string, userId?: string): Promise<TaxInvoiceListEmailConfigApiResponse>
  updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getSendToNTSConfig(corpNum: string, userId?: string): Promise<TaxInvoiceGetSendToNTSConfigApiResponse>

  // 인증서 관리
  getTaxCertURL(corpNum: string, userId?: string): Promise<TaxInvoiceGetTaxCertUrlApiResponse>
  getCertificateExpireDate(corpNum: string, userId?: string): Promise<string>
  checkCertValidation(corpNum: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getTaxCertInfo(corpNum: string, userId?: string): Promise<TaxInvoiceGetTaxCertInfoApiResponse>

  // 기타(legacy 호환)
  getChargeInfo(corpNum: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getUnitCost(corpNum: string, userId?: string): Promise<number>
  send(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, emailSubject?: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  cancelSend(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  accept(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  deny(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getOldPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getEmailPublicKeys(corpNum: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getPDF(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<Buffer>
}
