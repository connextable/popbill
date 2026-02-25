import { invokeTaxInvoiceMethod } from './adapters/error'
import { mapTaxInvoiceInfo } from './mappers/invoice-info'
import type {
  TaxInvoiceRequestOptions,
  TaxInvoiceService,
} from './types'
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
import type { TaxInvoiceSearchCloseDownState } from '@connextable/popbill-spec'
import type { PopbillApiError } from '@/errors'

interface CompatTaxInvoiceService {
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
  getInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetInfoApiResponse>
  getInfos(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string): Promise<TaxInvoiceGetInfosApiResponse>
  getDetailInfo(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetDetailInfoApiResponse>
  checkMgtKeyInUse(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<boolean>
  getXML(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetXmlApiResponse>
  search(corpNum: string, keyType: TaxInvoiceMgtKeyType, dType: string, startDate: string, endDate: string, state: string[], type: string[], taxType: string[], lateOnly: boolean | null, order: string, page: number, perPage: number, taxRegIDType?: string, taxRegIDYN?: string, taxRegID?: string, qString?: string, interOPYN?: string, userId?: string, issueType?: string[], regType?: string[], closeDownState?: (0 | 1 | 2 | 3 | 4)[], mgtKey?: string): Promise<TaxInvoiceSearchApiResponse>
  getLogs(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<TaxInvoiceGetLogsApiResponse>
  getURL(corpNum: string, togo: TaxInvoiceGetUrlTogo, userId?: string): Promise<string>
  getPopUpURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getViewURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getEPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getMassPrintURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKeyList: string[], userId?: string): Promise<string>
  getMailURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
  getPDFURL(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey: string, userId?: string): Promise<string>
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
  getTaxCertURL(corpNum: string, userId?: string): Promise<TaxInvoiceGetTaxCertUrlApiResponse>
  getCertificateExpireDate(corpNum: string, userId?: string): Promise<string>
  checkCertValidation(corpNum: string, userId?: string): Promise<TaxInvoiceApiResponseBase>
  getTaxCertInfo(corpNum: string, userId?: string): Promise<TaxInvoiceGetTaxCertInfoApiResponse>
}

interface CreateTaxInvoiceServiceInput {
  compatTaxInvoiceService: CompatTaxInvoiceService
  onError?: (error: PopbillApiError) => void
}

/**
 * TaxInvoice modern facade 서비스를 생성합니다.
 *
 * 입력 DTO를 compat positional 인자로 변환하고,
 * compat 에러를 `PopbillApiError`로 표준화하여 재throw 합니다.
 */
export function createTaxInvoiceService(input: CreateTaxInvoiceServiceInput): TaxInvoiceService {
  const compatTaxInvoiceService = input.compatTaxInvoiceService

  return {
    issueInvoiceImmediately(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.issueInvoiceImmediately', async () => compatTaxInvoiceService.registIssue(
        request.businessNumber,
        request.taxInvoiceDocument,
        request.writeSpecification,
        request.forceIssue,
        request.historyMemo,
        request.emailSubject,
        request.dealInvoiceManagementKey,
        extractUserId(options),
      ))
    },

    submitBulkIssue(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.submitBulkIssue', async () => compatTaxInvoiceService.bulkSubmit(
        request.businessNumber,
        request.submissionIdentifier,
        request.taxInvoiceDocuments,
        request.forceIssue,
        extractUserId(options),
      ))
    },

    getBulkIssueSubmissionResult(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBulkIssueSubmissionResult', async () => compatTaxInvoiceService.getBulkResult(
        request.businessNumber,
        request.submissionIdentifier,
        extractUserId(options),
      ))
    },

    registerInvoice(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.registerInvoice', async () => compatTaxInvoiceService.register(
        request.businessNumber,
        request.taxInvoiceDocument,
        extractUserId(options),
      ))
    },

    updateInvoice(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.updateInvoice', async () => compatTaxInvoiceService.update(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.taxInvoiceDocument,
        extractUserId(options),
      ))
    },

    issueInvoice(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.issueInvoice', async () => compatTaxInvoiceService.issue(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.historyMemo,
        request.emailSubject,
        request.forceIssue,
        extractUserId(options),
      ))
    },

    cancelIssuedInvoice(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.cancelIssuedInvoice', async () => compatTaxInvoiceService.cancelIssue(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.historyMemo,
        extractUserId(options),
      ))
    },

    requestReverseIssueImmediately(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.requestReverseIssueImmediately', async () => compatTaxInvoiceService.registRequest(
        request.businessNumber,
        request.taxInvoiceDocument,
        request.historyMemo,
        extractUserId(options),
      ))
    },

    requestReverseIssue(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.requestReverseIssue', async () => compatTaxInvoiceService.request(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.historyMemo,
        extractUserId(options),
      ))
    },

    cancelReverseIssueRequest(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.cancelReverseIssueRequest', async () => compatTaxInvoiceService.cancelRequest(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.historyMemo,
        extractUserId(options),
      ))
    },

    refuseReverseIssueRequest(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.refuseReverseIssueRequest', async () => compatTaxInvoiceService.refuse(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.historyMemo,
        extractUserId(options),
      ))
    },

    deleteInvoice(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.deleteInvoice', async () => compatTaxInvoiceService.delete(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    sendInvoiceToNTS(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.sendInvoiceToNTS', async () => compatTaxInvoiceService.sendToNTS(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    async getInvoiceInfo(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceInfo', async () => {
        const apiResponse = await compatTaxInvoiceService.getInfo(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          extractUserId(options),
        )

        return mapTaxInvoiceInfo(apiResponse)
      })
    },

    getInvoicesInfo(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicesInfo', async () => compatTaxInvoiceService.getInfos(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKeys,
        extractUserId(options),
      ))
    },

    getInvoiceDetailInfo(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceDetailInfo', async () => compatTaxInvoiceService.getDetailInfo(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    checkInvoiceManagementKeyInUse(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.checkInvoiceManagementKeyInUse', async () => compatTaxInvoiceService.checkMgtKeyInUse(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getInvoiceXML(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceXML', async () => compatTaxInvoiceService.getXML(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    searchInvoices(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.searchInvoices', async () => compatTaxInvoiceService.search(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.searchDateType,
        request.startDate,
        request.endDate,
        request.invoiceStateCodes,
        request.invoiceTypeCodes,
        request.taxationTypeCodes,
        request.lateIssueOnly,
        request.sortOrder,
        request.pageNumber,
        request.pageSize,
        request.taxRegistrationIdentifierType,
        request.taxRegistrationIdentifierAvailability,
        request.taxRegistrationIdentifier,
        request.queryText,
        request.interoperabilityType,
        extractUserId(options),
        request.issueTypeCodes,
        request.registrationTypeCodes,
        mapSearchCloseDownStateCodes(request.closeDownStateCodes),
        request.invoiceManagementKeyOrNationalTaxServiceConfirmationNumber,
      ))
    },

    getInvoiceLogs(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceLogs', async () => compatTaxInvoiceService.getLogs(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getTaxInvoiceBoxURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxInvoiceBoxURL', async () => compatTaxInvoiceService.getURL(
        request.businessNumber,
        request.taxInvoiceBoxScope,
        extractUserId(options),
      ))
    },

    getInvoicePopupURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicePopupURL', async () => compatTaxInvoiceService.getPopUpURL(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getInvoiceViewURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceViewURL', async () => compatTaxInvoiceService.getViewURL(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getSupplierInvoicePrintURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSupplierInvoicePrintURL', async () => compatTaxInvoiceService.getPrintURL(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getBuyerInvoicePrintURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBuyerInvoicePrintURL', async () => compatTaxInvoiceService.getEPrintURL(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getBulkInvoicePrintURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBulkInvoicePrintURL', async () => compatTaxInvoiceService.getMassPrintURL(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKeys,
        extractUserId(options),
      ))
    },

    getInvoiceMailURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceMailURL', async () => compatTaxInvoiceService.getMailURL(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getInvoicePDFURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicePDFURL', async () => compatTaxInvoiceService.getPDFURL(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getSealAndAttachmentRegistrationURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSealAndAttachmentRegistrationURL', async () => compatTaxInvoiceService.getSealURL(
        request.businessNumber,
        extractUserId(options),
      ))
    },

    attachFileFromPath(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachFileFromPath', async () => compatTaxInvoiceService.attachFile(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.displayName,
        request.filePath,
        extractUserId(options),
      ))
    },

    attachFileFromBinary(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachFileFromBinary', async () => compatTaxInvoiceService.attachFileBinary(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        {
          fileName: request.fileName,
          fileData: request.fileData,
        },
        extractUserId(options),
      ))
    },

    deleteAttachedFile(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.deleteAttachedFile', async () => compatTaxInvoiceService.deleteFile(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.fileIdentifier,
        extractUserId(options),
      ))
    },

    getAttachedFiles(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getAttachedFiles', async () => compatTaxInvoiceService.getFiles(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    resendInvoiceEmail(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceEmail', async () => compatTaxInvoiceService.sendEmail(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.receiverEmailAddress,
        extractUserId(options),
      ))
    },

    resendInvoiceSMS(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceSMS', async () => compatTaxInvoiceService.sendSMS(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.senderPhoneNumber,
        request.receiverPhoneNumber,
        request.messageBody,
        extractUserId(options),
      ))
    },

    resendInvoiceFAX(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceFAX', async () => compatTaxInvoiceService.sendFAX(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.senderNumber,
        request.receiverNumber,
        extractUserId(options),
      ))
    },

    attachInvoiceStatement(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachInvoiceStatement', async () => compatTaxInvoiceService.attachStatement(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.statementItemCode,
        request.statementManagementKey,
        extractUserId(options),
      ))
    },

    detachInvoiceStatement(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.detachInvoiceStatement', async () => compatTaxInvoiceService.detachStatement(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.invoiceManagementKey,
        request.statementItemCode,
        request.statementManagementKey,
        extractUserId(options),
      ))
    },

    assignInvoiceManagementKey(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.assignInvoiceManagementKey', async () => compatTaxInvoiceService.assignMgtKey(
        request.businessNumber,
        request.invoiceDocumentKeyType,
        request.itemKey,
        request.invoiceManagementKey,
        extractUserId(options),
      ))
    },

    getEmailSendSettings(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getEmailSendSettings', async () => compatTaxInvoiceService.listEmailConfig(
        request.businessNumber,
        extractUserId(options),
      ))
    },

    updateEmailSendSettings(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.updateEmailSendSettings', async () => compatTaxInvoiceService.updateEmailConfig(
        request.businessNumber,
        request.emailType,
        request.sendEnabled,
        extractUserId(options),
      ))
    },

    getSendToNTSSettings(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSendToNTSSettings', async () => compatTaxInvoiceService.getSendToNTSConfig(
        request.businessNumber,
        extractUserId(options),
      ))
    },

    getTaxCertificateRegistrationURL(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateRegistrationURL', async () => compatTaxInvoiceService.getTaxCertURL(
        request.businessNumber,
        extractUserId(options),
      ))
    },

    getTaxCertificateExpirationDate(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateExpirationDate', async () => compatTaxInvoiceService.getCertificateExpireDate(
        request.businessNumber,
        extractUserId(options),
      ))
    },

    checkTaxCertificateValidation(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.checkTaxCertificateValidation', async () => compatTaxInvoiceService.checkCertValidation(
        request.businessNumber,
        extractUserId(options),
      ))
    },

    getTaxCertificateInfo(request, options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateInfo', async () => compatTaxInvoiceService.getTaxCertInfo(
        request.businessNumber,
        extractUserId(options),
      ))
    },
  }
}

function extractUserId(options: TaxInvoiceRequestOptions | undefined): string | undefined {
  return options?.userId
}

/**
 * 검색조건의 휴폐업상태 코드를 compat 입력 형식(`0 | 1 | 2 | 3 | 4`)으로 정규화합니다.
 */
function mapSearchCloseDownStateCodes(
  closeDownStateCodes: TaxInvoiceSearchCloseDownState[] | undefined,
): (0 | 1 | 2 | 3 | 4)[] | undefined {
  if (!closeDownStateCodes) {
    return undefined
  }

  const normalizedCloseDownStateCodes = closeDownStateCodes
    .map(code => Number(code))
    .filter((code): code is 0 | 1 | 2 | 3 | 4 => code === 0 || code === 1 || code === 2 || code === 3 || code === 4)

  return normalizedCloseDownStateCodes.length > 0 ? normalizedCloseDownStateCodes : undefined
}
