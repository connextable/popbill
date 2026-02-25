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
  TaxInvoiceGetMailUrlApiResponse,
  TaxInvoiceGetMassPrintUrlApiResponse,
  TaxInvoiceGetPdfUrlApiResponse,
  TaxInvoiceGetPopUpUrlApiResponse,
  TaxInvoiceGetPrintUrlApiResponse,
  TaxInvoiceGetSealUrlApiResponse,
  TaxInvoiceGetSendToNTSConfigApiResponse,
  TaxInvoiceGetTaxCertInfoApiResponse,
  TaxInvoiceGetTaxCertUrlApiResponse,
  TaxInvoiceGetViewUrlApiResponse,
  TaxInvoiceGetXmlApiResponse,
  TaxInvoiceIssueApiResponse,
  TaxInvoiceKeyType,
  TaxInvoiceListEmailConfigApiResponse,
  TaxInvoiceRegistIssueApiResponse,
  TaxInvoiceSearchApiResponse,
} from '@connextable/popbill-spec'
import type { CompatConfig } from '../config'
import { createTypedCallbackServiceStub, type CallbackService } from '../adapters/callback-adapter'
import { createTypedPromiseServiceStub, type PromiseService } from '../adapters/promise-adapter'

const SERVICE_NAME = 'TaxinvoiceService'

type LegacySuccessCallback<T> = (response: T) => void

type LegacyErrorCallback = (error: unknown) => void

type LegacyUserIdOrSuccess<T> = string | LegacySuccessCallback<T>

type LegacySuccessOrError<T> = LegacySuccessCallback<T> | LegacyErrorCallback

/**
 * Callback 기반 legacy TaxinvoiceService 인터페이스 스캐폴드.
 */
export interface TaxinvoiceCallbackService {
  /** @deprecated legacy SDK에만 존재하는 API. */
  getChargeInfo(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<unknown>,
    successOrError?: LegacySuccessOrError<unknown>,
    error?: LegacyErrorCallback,
  ): void

  /** @deprecated legacy SDK에만 존재하는 API. */
  getUnitCost(corpNum: string, success?: LegacySuccessCallback<string>, error?: LegacyErrorCallback): void

  getCertificateExpireDate(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getTaxCertInfo(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetTaxCertInfoApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetTaxCertInfoApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  checkMgtKeyInUse(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<boolean>,
    successOrError?: LegacySuccessOrError<boolean>,
    error?: LegacyErrorCallback,
  ): void

  register(
    corpNum: string,
    taxinvoice: TaxInvoiceApiModel,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  update(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    taxinvoice: TaxInvoiceApiModel,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  delete(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getInfo(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetInfoApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetInfoApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getInfos(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKeyList: string[],
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetInfosApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetInfosApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getDetailInfo(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetDetailInfoApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetDetailInfoApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getXML(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetXmlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetXmlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getLogs(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetLogsApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetLogsApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  attachFileBinary(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    binaryFile: { fileName: string, fileData: Buffer },
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  attachFile(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    displayName: string,
    filePath: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getFiles(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetFilesApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetFilesApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  deleteFile(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    fileID: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  send(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    emailSubjectOrUserIdOrSuccess?: string | LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  cancelSend(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  /** @deprecated legacy SDK에만 존재하는 API. */
  accept(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  /** @deprecated legacy SDK에만 존재하는 API. */
  deny(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  issue(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    emailSubjectOrForceIssueOrUserIdOrSuccess?: string | boolean | LegacyUserIdOrSuccess<TaxInvoiceIssueApiResponse>,
    forceIssueOrUserIdOrSuccess?: boolean | LegacyUserIdOrSuccess<TaxInvoiceIssueApiResponse>,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceIssueApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  cancelIssue(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  registRequest(
    corpNum: string,
    taxinvoice: TaxInvoiceApiModel,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  request(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  cancelRequest(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  refuse(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  sendToNTS(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getSendToNTSConfig(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetSendToNTSConfigApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetSendToNTSConfigApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  sendEmail(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    receiver: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  sendSMS(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    contents: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  sendFAX(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  /** @deprecated legacy SDK에만 존재하는 API. */
  getURL(
    corpNum: string,
    togo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getPopUpURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetPopUpUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetPopUpUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getViewURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetViewUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetViewUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getPrintURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetPrintUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetPrintUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getPDFURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetPdfUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetPdfUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  /** @deprecated legacy SDK에만 존재하는 API. */
  getOldPrintURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getMassPrintURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKeyList: string[],
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetMassPrintUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetMassPrintUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getEPrintURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetViewUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetViewUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getMailURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetMailUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetMailUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  /** @deprecated legacy SDK에만 존재하는 API. */
  getEmailPublicKeys(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<unknown>,
    successOrError?: LegacySuccessOrError<unknown>,
    error?: LegacyErrorCallback,
  ): void

  /** @deprecated legacy SDK에만 존재하는 API. */
  getPDF(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<unknown>,
    successOrError?: LegacySuccessOrError<unknown>,
    error?: LegacyErrorCallback,
  ): void

  search(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    dType: string,
    startDate: string,
    endDate: string,
    state: string[],
    type: string[],
    taxType: string[],
    lateOnly: boolean | null,
    order: string,
    page: number,
    perPage: number,
    taxRegIDTypeOrUserIdOrSuccess?: string | LegacyUserIdOrSuccess<TaxInvoiceSearchApiResponse>,
    taxRegIDYN?: string,
    taxRegID?: string,
    qString?: string,
    interOPYN?: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceSearchApiResponse>,
    issueType?: string[],
    regType?: string[],
    closeDownState?: (0 | 1 | 2 | 3 | 4)[],
    mgtKey?: string,
    successOrError?: LegacySuccessOrError<TaxInvoiceSearchApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  registIssue(
    corpNum: string,
    taxinvoice: TaxInvoiceApiModel,
    writeSpecification?: boolean,
    forceIssue?: boolean,
    memo?: string,
    emailSubject?: string,
    dealInvoiceMgtKey?: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceRegistIssueApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceRegistIssueApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  bulkSubmit(
    corpNum: string,
    submitID: string,
    taxinvoiceList: TaxInvoiceApiModel[],
    forceIssue?: boolean,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceBulkSubmitApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceBulkSubmitApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getBulkResult(
    corpNum: string,
    submitID: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetBulkResultApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetBulkResultApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  attachStatement(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  detachStatement(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  checkCertValidation(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  assignMgtKey(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    itemKey: string,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  listEmailConfig(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceListEmailConfigApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceListEmailConfigApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  updateEmailConfig(
    corpNum: string,
    emailType: string,
    sendYN: boolean,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getSealURL(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetSealUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetSealUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getTaxCertURL(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetTaxCertUrlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetTaxCertUrlApiResponse>,
    error?: LegacyErrorCallback,
  ): void
}

/**
 * Promise 기반 legacy TaxinvoiceService 인터페이스 스캐폴드.
 */
export interface TaxinvoicePromiseService {
  /** @deprecated legacy SDK에만 존재하는 API. */
  getChargeInfo(corpNum: string, userId?: string): Promise<unknown>
  /** @deprecated legacy SDK에만 존재하는 API. */
  getUnitCost(corpNum: string): Promise<string>

  getCertificateExpireDate(corpNum: string, userId?: string): Promise<string>
  getTaxCertInfo(corpNum: string, userId?: string): Promise<TaxInvoiceGetTaxCertInfoApiResponse>

  checkMgtKeyInUse(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<boolean>

  register(corpNum: string, taxinvoice: TaxInvoiceApiModel, userId?: string): Promise<TaxInvoiceApiResponseBase>
  update(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    taxinvoice: TaxInvoiceApiModel,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  delete(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>

  getInfo(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetInfoApiResponse>
  getInfos(corpNum: string, keyType: TaxInvoiceKeyType, mgtKeyList: string[], userId?: string): Promise<TaxInvoiceGetInfosApiResponse>
  getDetailInfo(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    userId?: string,
  ): Promise<TaxInvoiceGetDetailInfoApiResponse>
  getXML(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetXmlApiResponse>
  getLogs(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetLogsApiResponse>

  attachFileBinary(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    binaryFile: { fileName: string, fileData: Buffer },
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  attachFile(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    displayName: string,
    filePath: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  getFiles(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetFilesApiResponse>
  deleteFile(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    fileID: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  send(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    emailSubject?: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  cancelSend(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  /** @deprecated legacy SDK에만 존재하는 API. */
  accept(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  /** @deprecated legacy SDK에만 존재하는 API. */
  deny(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>

  issue(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    emailSubject?: string,
    forceIssue?: boolean,
    userId?: string,
  ): Promise<TaxInvoiceIssueApiResponse>
  cancelIssue(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  registRequest(corpNum: string, taxinvoice: TaxInvoiceApiModel, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  request(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  cancelRequest(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  refuse(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  sendToNTS(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>

  getSendToNTSConfig(corpNum: string, userId?: string): Promise<TaxInvoiceGetSendToNTSConfigApiResponse>

  sendEmail(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    receiver: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  sendSMS(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    contents: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  sendFAX(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  /** @deprecated legacy SDK에만 존재하는 API. */
  getURL(corpNum: string, togo: string, userId?: string): Promise<string>

  getPopUpURL(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetPopUpUrlApiResponse>
  getViewURL(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetViewUrlApiResponse>
  getPrintURL(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetPrintUrlApiResponse>
  getPDFURL(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetPdfUrlApiResponse>

  /** @deprecated legacy SDK에만 존재하는 API. */
  getOldPrintURL(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<string>

  getMassPrintURL(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKeyList: string[],
    userId?: string,
  ): Promise<TaxInvoiceGetMassPrintUrlApiResponse>
  getEPrintURL(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetViewUrlApiResponse>
  getMailURL(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetMailUrlApiResponse>

  /** @deprecated legacy SDK에만 존재하는 API. */
  getEmailPublicKeys(corpNum: string, userId?: string): Promise<unknown>
  /** @deprecated legacy SDK에만 존재하는 API. */
  getPDF(corpNum: string, keyType: TaxInvoiceKeyType, mgtKey: string, userId?: string): Promise<unknown>

  search(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    dType: string,
    startDate: string,
    endDate: string,
    state: string[],
    type: string[],
    taxType: string[],
    lateOnly: boolean | null,
    order: string,
    page: number,
    perPage: number,
    taxRegIDType?: string,
    taxRegIDYN?: string,
    taxRegID?: string,
    qString?: string,
    interOPYN?: string,
    userId?: string,
    issueType?: string[],
    regType?: string[],
    closeDownState?: (0 | 1 | 2 | 3 | 4)[],
    mgtKey?: string,
  ): Promise<TaxInvoiceSearchApiResponse>

  registIssue(
    corpNum: string,
    taxinvoice: TaxInvoiceApiModel,
    writeSpecification?: boolean,
    forceIssue?: boolean,
    memo?: string,
    emailSubject?: string,
    dealInvoiceMgtKey?: string,
    userId?: string,
  ): Promise<TaxInvoiceRegistIssueApiResponse>
  bulkSubmit(
    corpNum: string,
    submitID: string,
    taxinvoiceList: TaxInvoiceApiModel[],
    forceIssue?: boolean,
    userId?: string,
  ): Promise<TaxInvoiceBulkSubmitApiResponse>
  getBulkResult(corpNum: string, submitID: string, userId?: string): Promise<TaxInvoiceGetBulkResultApiResponse>

  attachStatement(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  detachStatement(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  checkCertValidation(corpNum: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  assignMgtKey(
    corpNum: string,
    keyType: TaxInvoiceKeyType,
    itemKey: string,
    mgtKey: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  listEmailConfig(corpNum: string, userId?: string): Promise<TaxInvoiceListEmailConfigApiResponse>
  updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getSealURL(corpNum: string, userId?: string): Promise<TaxInvoiceGetSealUrlApiResponse>
  getTaxCertURL(corpNum: string, userId?: string): Promise<TaxInvoiceGetTaxCertUrlApiResponse>
}

const TAXINVOICE_METHOD_NAMES = [
  'getChargeInfo',
  'getUnitCost',
  'getCertificateExpireDate',
  'getTaxCertInfo',
  'checkMgtKeyInUse',
  'register',
  'update',
  'delete',
  'getInfo',
  'getInfos',
  'getDetailInfo',
  'getXML',
  'getLogs',
  'attachFileBinary',
  'attachFile',
  'getFiles',
  'deleteFile',
  'send',
  'cancelSend',
  'accept',
  'deny',
  'issue',
  'cancelIssue',
  'registRequest',
  'request',
  'cancelRequest',
  'refuse',
  'sendToNTS',
  'getSendToNTSConfig',
  'sendEmail',
  'sendSMS',
  'sendFAX',
  'getURL',
  'getPopUpURL',
  'getViewURL',
  'getPrintURL',
  'getPDFURL',
  'getOldPrintURL',
  'getMassPrintURL',
  'getEPrintURL',
  'getMailURL',
  'getEmailPublicKeys',
  'getPDF',
  'search',
  'registIssue',
  'bulkSubmit',
  'getBulkResult',
  'attachStatement',
  'detachStatement',
  'checkCertValidation',
  'assignMgtKey',
  'listEmailConfig',
  'updateEmailConfig',
  'getSealURL',
  'getTaxCertURL',
] as const satisfies readonly (keyof TaxinvoiceCallbackService & string)[]

export function createTaxinvoiceService(_config: CompatConfig): CallbackService {
  return createTypedCallbackServiceStub<TaxinvoiceCallbackService>(SERVICE_NAME, TAXINVOICE_METHOD_NAMES) as unknown as CallbackService
}

export function createTaxinvoicePromiseService(_config: CompatConfig): PromiseService {
  return createTypedPromiseServiceStub<TaxinvoicePromiseService>(SERVICE_NAME, TAXINVOICE_METHOD_NAMES) as unknown as PromiseService
}
