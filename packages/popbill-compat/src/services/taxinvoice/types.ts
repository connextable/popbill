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

export type LegacySuccessCallback<T> = (response: T) => void

export type LegacyErrorCallback = (error: unknown) => void

export type LegacyUserIdOrSuccess<T> = string | LegacySuccessCallback<T>

export type LegacySuccessOrError<T> = LegacySuccessCallback<T> | LegacyErrorCallback

/**
 * Callback 기반 legacy TaxinvoiceService 인터페이스.
 */
export interface TaxinvoiceCallbackService {
  getChargeInfo(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getUnitCost(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<number>,
    successOrError?: LegacySuccessOrError<number>,
    error?: LegacyErrorCallback,
  ): void

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
    keyType: TaxInvoiceMgtKeyType,
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
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    taxinvoice: TaxInvoiceApiModel,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  delete(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getInfo(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetInfoApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetInfoApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getInfos(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKeyList: string[],
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetInfosApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetInfosApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getDetailInfo(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetDetailInfoApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetDetailInfoApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getXML(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetXmlApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetXmlApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  getLogs(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetLogsApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetLogsApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  attachFileBinary(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    binaryFile: { fileName: string, fileData: Buffer },
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  attachFile(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    displayName: string,
    filePath: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getFiles(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceGetFilesApiResponse>,
    successOrError?: LegacySuccessOrError<TaxInvoiceGetFilesApiResponse>,
    error?: LegacyErrorCallback,
  ): void

  deleteFile(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    fileID: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  send(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    emailSubjectOrUserIdOrSuccess?: string | LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  cancelSend(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  accept(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  deny(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  issue(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
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
    keyType: TaxInvoiceMgtKeyType,
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
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  cancelRequest(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  refuse(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  sendToNTS(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
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
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    receiver: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  sendSMS(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
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
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getURL(
    corpNum: string,
    togo: TaxInvoiceGetUrlTogo,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getPopUpURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getViewURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getPrintURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getPDFURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getOldPrintURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getMassPrintURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKeyList: string[],
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getEPrintURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getMailURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<string>,
    successOrError?: LegacySuccessOrError<string>,
    error?: LegacyErrorCallback,
  ): void

  getEmailPublicKeys(
    corpNum: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  getPDF(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<Buffer>,
    successOrError?: LegacySuccessOrError<Buffer>,
    error?: LegacyErrorCallback,
  ): void

  search(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
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
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userIdOrSuccess?: LegacyUserIdOrSuccess<TaxInvoiceApiResponseBase>,
    successOrError?: LegacySuccessOrError<TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback,
  ): void

  detachStatement(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
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
    keyType: TaxInvoiceMgtKeyType,
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
 * Promise 기반 legacy TaxinvoiceService 인터페이스.
 */
export interface TaxinvoicePromiseService {
  getChargeInfo(corpNum: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getUnitCost(corpNum: string, userId?: string): Promise<number>
  getCertificateExpireDate(corpNum: string, userId?: string): Promise<string>
  getTaxCertInfo(corpNum: string, userId?: string): Promise<TaxInvoiceGetTaxCertInfoApiResponse>

  checkMgtKeyInUse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<boolean>

  register(corpNum: string, taxinvoice: TaxInvoiceApiModel, userId?: string): Promise<TaxInvoiceApiResponseBase>
  update(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    taxinvoice: TaxInvoiceApiModel,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  delete(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>

  getInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetInfoApiResponse>
  getInfos(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string): Promise<TaxInvoiceGetInfosApiResponse>
  getDetailInfo(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    userId?: string,
  ): Promise<TaxInvoiceGetDetailInfoApiResponse>
  getXML(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetXmlApiResponse>
  getLogs(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetLogsApiResponse>

  attachFileBinary(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    binaryFile: { fileName: string, fileData: Buffer },
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  attachFile(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    displayName: string,
    filePath: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  getFiles(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetFilesApiResponse>
  deleteFile(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    fileID: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  send(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    emailSubject?: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  cancelSend(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  accept(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  deny(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  issue(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    emailSubject?: string,
    forceIssue?: boolean,
    userId?: string,
  ): Promise<TaxInvoiceIssueApiResponse>
  cancelIssue(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  registRequest(corpNum: string, taxinvoice: TaxInvoiceApiModel, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  request(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  cancelRequest(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    memo: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  refuse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, memo: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  sendToNTS(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceApiResponseBase>

  getSendToNTSConfig(corpNum: string, userId?: string): Promise<TaxInvoiceGetSendToNTSConfigApiResponse>

  sendEmail(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    receiver: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  sendSMS(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    contents: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  sendFAX(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  getURL(corpNum: string, togo: TaxInvoiceGetUrlTogo, userId?: string): Promise<string>

  getPopUpURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getViewURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getPDFURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getOldPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>

  getMassPrintURL(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKeyList: string[],
    userId?: string,
  ): Promise<string>
  getEPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getMailURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>

  getEmailPublicKeys(corpNum: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getPDF(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<Buffer>

  search(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
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
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>
  detachStatement(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  checkCertValidation(corpNum: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  assignMgtKey(
    corpNum: string,
    keyType: TaxInvoiceMgtKeyType,
    itemKey: string,
    mgtKey: string,
    userId?: string,
  ): Promise<TaxInvoiceApiResponseBase>

  listEmailConfig(corpNum: string, userId?: string): Promise<TaxInvoiceListEmailConfigApiResponse>
  updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getSealURL(corpNum: string, userId?: string): Promise<TaxInvoiceGetSealUrlApiResponse>
  getTaxCertURL(corpNum: string, userId?: string): Promise<TaxInvoiceGetTaxCertUrlApiResponse>
}
