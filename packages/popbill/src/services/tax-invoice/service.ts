import { invokeTaxInvoiceMethod } from './adapters/error'
import { mapTaxInvoiceDocument, mapTaxInvoiceDocuments } from './mappers/document'
import { mapTaxInvoiceInfo } from './mappers/invoice-info'
import {
  mapTaxInvoiceAccessUrl,
  mapTaxInvoiceAccessUrlFromString,
  mapTaxInvoiceAttachedFiles,
  mapTaxInvoiceBulkIssueSubmissionResult,
  mapTaxInvoiceBulkSubmitResult,
  mapTaxInvoiceDocumentOutput,
  mapTaxInvoiceEmailSendSettings,
  mapTaxInvoiceInfos,
  mapTaxInvoiceInvoiceManagementKeyUsage,
  mapTaxInvoiceIssueResult,
  mapTaxInvoiceLogs,
  mapTaxInvoiceOperationResult,
  mapTaxInvoiceSearchResult,
  mapTaxInvoiceSendToNationalTaxServiceSetting,
  mapTaxInvoiceTaxCertificateExpiration,
  mapTaxInvoiceTaxCertificateInfo,
  mapTaxInvoiceXmlResult,
} from './mappers/response'
import {
  TaxInvoiceCloseDownStateCodes,
  TaxInvoiceDateType,
  TaxInvoiceEmailTypes,
  TaxInvoiceSearchInteroperabilityTypes,
  TaxInvoiceSearchInvoiceTypeCodes,
  TaxInvoiceSearchIssueTypeCodes,
  TaxInvoiceSearchRegistrationTypeCodes,
  TaxInvoiceSearchTaxationTypeCodes,
  TaxInvoiceSearchTaxRegistrationIdentifierAvailabilities,
  TaxInvoiceSearchTaxRegistrationIdentifierTypes,
  TaxInvoiceSortOrder,
  TaxInvoiceStatementItemCodes,
  type SearchInvoicesInput,
  type TaxInvoiceCloseDownStateCode,
  type TaxInvoiceDateInput,
  type TaxInvoiceEmailType,
  type TaxInvoiceSearchInteroperabilityType,
  type TaxInvoiceSearchInvoiceTypeCode,
  type TaxInvoiceSearchIssueTypeCode,
  type TaxInvoiceSearchRegistrationTypeCode,
  type TaxInvoiceSearchStateCode,
  type TaxInvoiceSearchTaxationTypeCode,
  type TaxInvoiceSearchTaxRegistrationIdentifierAvailability,
  type TaxInvoiceSearchTaxRegistrationIdentifierType,
  type TaxInvoiceService,
  type TaxInvoiceStatementItemCode,
} from './types'
import { createInputValidationError } from '@connextable/popbill-compat/errors'
import type { TaxinvoicePromiseService as CompatTaxInvoiceService } from '@connextable/popbill-compat/factory'
import { PopbillErrorStage, type PopbillApiError } from '@/errors'

const KOREA_TIME_ZONE = 'Asia/Seoul'
const SEARCH_STATE_CODE_PATTERN = /^\d[\d*][\d*]$/
const KOREA_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: KOREA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const SEARCH_INVOICES_OPERATION = 'taxInvoice.searchInvoices'

interface CreateTaxInvoiceServiceInput {
  compatTaxInvoiceService: CompatTaxInvoiceService
  defaultUserId: string
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
    issueInvoiceImmediately(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.issueInvoiceImmediately', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.registIssue(
          request.businessNumber,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          request.writeSpecification,
          request.forceIssue,
          request.historyMemo,
          request.emailSubject,
          request.dealInvoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceIssueResult(taxInvoiceApiResponse)
      })
    },

    submitBulkIssue(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.submitBulkIssue', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.bulkSubmit(
          request.businessNumber,
          request.submissionIdentifier,
          mapTaxInvoiceDocuments(request.taxInvoiceDocuments),
          request.forceIssue,
          input.defaultUserId
        )

        return mapTaxInvoiceBulkSubmitResult(taxInvoiceApiResponse)
      })
    },

    getBulkIssueSubmissionResult(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBulkIssueSubmissionResult', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getBulkResult(
          request.businessNumber,
          request.submissionIdentifier,
          input.defaultUserId
        )

        return mapTaxInvoiceBulkIssueSubmissionResult(taxInvoiceApiResponse)
      })
    },

    registerInvoice(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.registerInvoice', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.register(
          request.businessNumber,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    updateInvoice(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.updateInvoice', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.update(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    issueInvoice(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.issueInvoice', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.issue(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          request.emailSubject,
          request.forceIssue,
          input.defaultUserId
        )

        return mapTaxInvoiceIssueResult(taxInvoiceApiResponse)
      })
    },

    cancelIssuedInvoice(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.cancelIssuedInvoice', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.cancelIssue(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    requestReverseIssueImmediately(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.requestReverseIssueImmediately', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.registRequest(
          request.businessNumber,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          request.historyMemo,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    requestReverseIssue(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.requestReverseIssue', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.request(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    cancelReverseIssueRequest(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.cancelReverseIssueRequest', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.cancelRequest(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    refuseReverseIssueRequest(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.refuseReverseIssueRequest', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.refuse(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    deleteInvoice(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.deleteInvoice', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.delete(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    sendInvoiceToNTS(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.sendInvoiceToNTS', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.sendToNTS(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    async getInvoiceInfo(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceInfo', async () => {
        const apiResponse = await compatTaxInvoiceService.getInfo(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceInfo(apiResponse)
      })
    },

    getInvoicesInfo(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicesInfo', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getInfos(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKeys,
          input.defaultUserId
        )

        return mapTaxInvoiceInfos(taxInvoiceApiResponse)
      })
    },

    getInvoiceDetailInfo(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceDetailInfo', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getDetailInfo(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceDocumentOutput(taxInvoiceApiResponse)
      })
    },

    checkInvoiceManagementKeyInUse(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.checkInvoiceManagementKeyInUse', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.checkMgtKeyInUse(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceInvoiceManagementKeyUsage(taxInvoiceApiResponse)
      })
    },

    getInvoiceXML(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceXML', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getXML(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceXmlResult(taxInvoiceApiResponse)
      })
    },

    searchInvoices(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.searchInvoices', async () => {
        const normalizedSearchRequest = normalizeSearchInvoicesRequest(request)
        const taxInvoiceApiResponse = await compatTaxInvoiceService.search(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          normalizedSearchRequest.searchDateType,
          normalizedSearchRequest.startDate,
          normalizedSearchRequest.endDate,
          normalizedSearchRequest.invoiceStateCodes,
          normalizedSearchRequest.invoiceTypeCodes,
          normalizedSearchRequest.taxationTypeCodes,
          normalizedSearchRequest.lateIssueOnly,
          normalizedSearchRequest.sortOrder,
          normalizedSearchRequest.pageNumber,
          normalizedSearchRequest.pageSize,
          normalizedSearchRequest.taxRegistrationIdentifierType,
          normalizedSearchRequest.taxRegistrationIdentifierAvailability,
          normalizedSearchRequest.taxRegistrationIdentifier,
          normalizedSearchRequest.queryText,
          normalizedSearchRequest.interoperabilityType,
          input.defaultUserId,
          normalizedSearchRequest.issueTypeCodes,
          normalizedSearchRequest.registrationTypeCodes,
          toCompatCloseDownStateCodes(normalizedSearchRequest.closeDownStateCodes),
          normalizedSearchRequest.invoiceManagementKeyOrNationalTaxServiceConfirmationNumber
        )

        return mapTaxInvoiceSearchResult(taxInvoiceApiResponse)
      })
    },

    getInvoiceLogs(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceLogs', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getLogs(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceLogs(taxInvoiceApiResponse)
      })
    },

    getTaxInvoiceBoxURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxInvoiceBoxURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getURL(
          request.businessNumber,
          request.taxInvoiceBoxScope,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getInvoicePopupURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicePopupURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getPopUpURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getInvoiceViewURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceViewURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getViewURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getSupplierInvoicePrintURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSupplierInvoicePrintURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getPrintURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getBuyerInvoicePrintURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBuyerInvoicePrintURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getEPrintURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getBulkInvoicePrintURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBulkInvoicePrintURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getMassPrintURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKeys,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getInvoiceMailURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceMailURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getMailURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getInvoicePDFURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicePDFURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getPDFURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getSealAndAttachmentRegistrationURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSealAndAttachmentRegistrationURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getSealURL(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceAccessUrl(taxInvoiceApiResponse)
      })
    },

    attachFileFromPath(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachFileFromPath', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.attachFile(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.displayName,
          request.filePath,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    attachFileFromBinary(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachFileFromBinary', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.attachFileBinary(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          {
            fileName: request.fileName,
            fileData: request.fileData,
          },
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    deleteAttachedFile(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.deleteAttachedFile', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.deleteFile(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.fileIdentifier,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    getAttachedFiles(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getAttachedFiles', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getFiles(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceAttachedFiles(taxInvoiceApiResponse)
      })
    },

    resendInvoiceEmail(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceEmail', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.sendEmail(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.receiverEmailAddress,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    resendInvoiceSMS(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceSMS', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.sendSMS(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.senderPhoneNumber,
          request.receiverPhoneNumber,
          request.messageBody,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    resendInvoiceFAX(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceFAX', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.sendFAX(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.senderNumber,
          request.receiverNumber,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    attachInvoiceStatement(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachInvoiceStatement', async () => {
        const statementItemCode = normalizeStatementItemCode(
          request.statementItemCode,
          'taxInvoice.attachInvoiceStatement'
        )
        const taxInvoiceApiResponse = await compatTaxInvoiceService.attachStatement(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          statementItemCode,
          request.statementManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    detachInvoiceStatement(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.detachInvoiceStatement', async () => {
        const statementItemCode = normalizeStatementItemCode(
          request.statementItemCode,
          'taxInvoice.detachInvoiceStatement'
        )
        const taxInvoiceApiResponse = await compatTaxInvoiceService.detachStatement(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          statementItemCode,
          request.statementManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    assignInvoiceManagementKey(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.assignInvoiceManagementKey', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.assignMgtKey(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.itemKey,
          request.invoiceManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    getEmailSendSettings(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getEmailSendSettings', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.listEmailConfig(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceEmailSendSettings(taxInvoiceApiResponse)
      })
    },

    updateEmailSendSettings(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.updateEmailSendSettings', async () => {
        const emailType = normalizeEmailType(request.emailType, 'taxInvoice.updateEmailSendSettings')
        const taxInvoiceApiResponse = await compatTaxInvoiceService.updateEmailConfig(
          request.businessNumber,
          emailType,
          request.sendEnabled,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    getSendToNTSSettings(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSendToNTSSettings', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getSendToNTSConfig(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceSendToNationalTaxServiceSetting(taxInvoiceApiResponse)
      })
    },

    getTaxCertificateRegistrationURL(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateRegistrationURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getTaxCertURL(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceAccessUrl(taxInvoiceApiResponse)
      })
    },

    getTaxCertificateExpirationDate(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateExpirationDate', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getCertificateExpireDate(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceTaxCertificateExpiration(taxInvoiceApiResponse)
      })
    },

    checkTaxCertificateValidation(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.checkTaxCertificateValidation', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.checkCertValidation(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    getTaxCertificateInfo(request) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateInfo', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getTaxCertInfo(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceTaxCertificateInfo(taxInvoiceApiResponse)
      })
    },
  }
}

interface NormalizedSearchInvoicesRequest {
  searchDateType: TaxInvoiceDateType
  startDate: string
  endDate: string
  invoiceStateCodes: TaxInvoiceSearchStateCode[]
  invoiceTypeCodes: TaxInvoiceSearchInvoiceTypeCode[]
  taxationTypeCodes: TaxInvoiceSearchTaxationTypeCode[]
  lateIssueOnly: boolean | null
  sortOrder: TaxInvoiceSortOrder
  pageNumber: number
  pageSize: number
  taxRegistrationIdentifierType?: TaxInvoiceSearchTaxRegistrationIdentifierType
  taxRegistrationIdentifierAvailability?: TaxInvoiceSearchTaxRegistrationIdentifierAvailability
  taxRegistrationIdentifier?: string
  queryText?: string
  interoperabilityType?: TaxInvoiceSearchInteroperabilityType
  issueTypeCodes?: TaxInvoiceSearchIssueTypeCode[]
  registrationTypeCodes?: TaxInvoiceSearchRegistrationTypeCode[]
  closeDownStateCodes?: TaxInvoiceCloseDownStateCode[]
  invoiceManagementKeyOrNationalTaxServiceConfirmationNumber?: string
}

function normalizeSearchInvoicesRequest(request: SearchInvoicesInput): NormalizedSearchInvoicesRequest {
  return {
    searchDateType: normalizeCodeValue(
      request.searchDateType,
      Object.values(TaxInvoiceDateType),
      'searchDateType',
      SEARCH_INVOICES_OPERATION
    ),
    startDate: normalizeSearchDateInput(request.startDate, 'startDate', SEARCH_INVOICES_OPERATION),
    endDate: normalizeSearchDateInput(request.endDate, 'endDate', SEARCH_INVOICES_OPERATION),
    invoiceStateCodes: normalizeSearchStateCodes(request.invoiceStateCodes),
    invoiceTypeCodes: normalizeCodeArray(
      request.invoiceTypeCodes,
      Object.values(TaxInvoiceSearchInvoiceTypeCodes),
      'invoiceTypeCodes',
      SEARCH_INVOICES_OPERATION
    ),
    taxationTypeCodes: normalizeCodeArray(
      request.taxationTypeCodes,
      Object.values(TaxInvoiceSearchTaxationTypeCodes),
      'taxationTypeCodes',
      SEARCH_INVOICES_OPERATION
    ),
    lateIssueOnly: request.lateIssueOnly,
    sortOrder: normalizeCodeValue(
      request.sortOrder,
      Object.values(TaxInvoiceSortOrder),
      'sortOrder',
      SEARCH_INVOICES_OPERATION
    ),
    pageNumber: request.pageNumber,
    pageSize: request.pageSize,
    taxRegistrationIdentifierType: normalizeOptionalCodeValue(
      request.taxRegistrationIdentifierType,
      Object.values(TaxInvoiceSearchTaxRegistrationIdentifierTypes),
      'taxRegistrationIdentifierType',
      SEARCH_INVOICES_OPERATION
    ),
    taxRegistrationIdentifierAvailability: normalizeOptionalCodeValue(
      request.taxRegistrationIdentifierAvailability,
      Object.values(TaxInvoiceSearchTaxRegistrationIdentifierAvailabilities),
      'taxRegistrationIdentifierAvailability',
      SEARCH_INVOICES_OPERATION
    ),
    taxRegistrationIdentifier: request.taxRegistrationIdentifier,
    queryText: request.queryText,
    interoperabilityType: normalizeOptionalCodeValue(
      request.interoperabilityType,
      Object.values(TaxInvoiceSearchInteroperabilityTypes),
      'interoperabilityType',
      SEARCH_INVOICES_OPERATION
    ),
    issueTypeCodes: normalizeOptionalCodeArray(
      request.issueTypeCodes,
      Object.values(TaxInvoiceSearchIssueTypeCodes),
      'issueTypeCodes',
      SEARCH_INVOICES_OPERATION
    ),
    registrationTypeCodes: normalizeOptionalCodeArray(
      request.registrationTypeCodes,
      Object.values(TaxInvoiceSearchRegistrationTypeCodes),
      'registrationTypeCodes',
      SEARCH_INVOICES_OPERATION
    ),
    closeDownStateCodes: normalizeOptionalCodeArray(
      request.closeDownStateCodes,
      Object.values(TaxInvoiceCloseDownStateCodes),
      'closeDownStateCodes',
      SEARCH_INVOICES_OPERATION
    ),
    invoiceManagementKeyOrNationalTaxServiceConfirmationNumber:
      request.invoiceManagementKeyOrNationalTaxServiceConfirmationNumber,
  }
}

function toCompatCloseDownStateCodes(
  closeDownStateCodes: TaxInvoiceCloseDownStateCode[] | undefined
): (0 | 1 | 2 | 3 | 4)[] | undefined {
  return closeDownStateCodes as unknown as (0 | 1 | 2 | 3 | 4)[] | undefined
}

function normalizeSearchStateCodes(searchStateCodes: unknown): TaxInvoiceSearchStateCode[] {
  if (!Array.isArray(searchStateCodes)) {
    throw createInputValidationError('invoiceStateCodes는 배열이어야 해.', {
      operation: SEARCH_INVOICES_OPERATION,
      stage: PopbillErrorStage.ValidateInput,
    })
  }

  return searchStateCodes.map((searchStateCode, index) => {
    if (typeof searchStateCode !== 'string' || !SEARCH_STATE_CODE_PATTERN.test(searchStateCode)) {
      throw createInputValidationError(
        `invoiceStateCodes[${index}]에 유효하지 않은 상태코드가 있어. 허용 패턴: 숫자 3자리 또는 2/3자리 와일드카드 (예: 300, 3**, 60*)`,
        {
          operation: SEARCH_INVOICES_OPERATION,
          stage: PopbillErrorStage.ValidateInput,
        }
      )
    }

    return searchStateCode
  })
}

function normalizeSearchDateInput(dateInput: TaxInvoiceDateInput, fieldName: string, operation: string): string {
  if (dateInput instanceof Date) {
    if (!Number.isFinite(dateInput.getTime())) {
      throw createInputValidationError(`${fieldName}는 유효한 Date여야 해.`, {
        operation,
        stage: PopbillErrorStage.ValidateInput,
      })
    }

    return formatDateToKoreaDateString(dateInput)
  }

  if (typeof dateInput !== 'string') {
    throw createInputValidationError(`${fieldName}는 yyyyMMdd 문자열 또는 Date여야 해.`, {
      operation,
      stage: PopbillErrorStage.ValidateInput,
    })
  }

  const normalizedDateInput = dateInput.trim()
  if (!isValidDateString(normalizedDateInput)) {
    throw createInputValidationError(`${fieldName}는 yyyyMMdd 형식의 유효한 날짜여야 해.`, {
      operation,
      stage: PopbillErrorStage.ValidateInput,
    })
  }

  return normalizedDateInput
}

function formatDateToKoreaDateString(date: Date): string {
  let year = ''
  let month = ''
  let day = ''

  for (const datePart of KOREA_DATE_FORMATTER.formatToParts(date)) {
    if (datePart.type === 'year') {
      year = datePart.value
      continue
    }

    if (datePart.type === 'month') {
      month = datePart.value
      continue
    }

    if (datePart.type === 'day') {
      day = datePart.value
    }
  }

  return `${year}${month}${day}`
}

function isValidDateString(dateString: string): boolean {
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(dateString)
  if (!match) {
    return false
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const normalizedDate = new Date(Date.UTC(year, month - 1, day))

  return (
    normalizedDate.getUTCFullYear() === year &&
    normalizedDate.getUTCMonth() === month - 1 &&
    normalizedDate.getUTCDate() === day
  )
}

function normalizeStatementItemCode(
  statementItemCode: unknown,
  operation: 'taxInvoice.attachInvoiceStatement' | 'taxInvoice.detachInvoiceStatement'
): TaxInvoiceStatementItemCode {
  return normalizeCodeValue(
    statementItemCode,
    Object.values(TaxInvoiceStatementItemCodes),
    'statementItemCode',
    operation
  )
}

function normalizeEmailType(emailType: unknown, operation: 'taxInvoice.updateEmailSendSettings'): TaxInvoiceEmailType {
  return normalizeCodeValue(emailType, Object.values(TaxInvoiceEmailTypes), 'emailType', operation)
}

function normalizeOptionalCodeValue<T extends string | number>(
  codeValue: unknown,
  allowedValues: readonly T[],
  fieldName: string,
  operation: string
): T | undefined {
  if (codeValue === undefined) {
    return undefined
  }

  return normalizeCodeValue(codeValue, allowedValues, fieldName, operation)
}

function normalizeOptionalCodeArray<T extends string | number>(
  codeValues: unknown,
  allowedValues: readonly T[],
  fieldName: string,
  operation: string
): T[] | undefined {
  if (codeValues === undefined) {
    return undefined
  }

  return normalizeCodeArray(codeValues, allowedValues, fieldName, operation)
}

function normalizeCodeArray<T extends string | number>(
  codeValues: unknown,
  allowedValues: readonly T[],
  fieldName: string,
  operation: string
): T[] {
  if (!Array.isArray(codeValues)) {
    throw createInputValidationError(`${fieldName}는 배열이어야 해.`, {
      operation,
      stage: PopbillErrorStage.ValidateInput,
    })
  }

  return codeValues.map((codeValue, index) =>
    normalizeCodeValue(codeValue, allowedValues, `${fieldName}[${index}]`, operation)
  )
}

function normalizeCodeValue<T extends string | number>(
  codeValue: unknown,
  allowedValues: readonly T[],
  fieldName: string,
  operation: string
): T {
  for (const allowedValue of allowedValues) {
    if (codeValue === allowedValue) {
      return allowedValue
    }
  }

  throw createInputValidationError(
    `${fieldName}에 유효하지 않은 값이 있어. 허용값: ${allowedValues.map((allowedValue) => String(allowedValue)).join(', ')} (입력값: ${String(codeValue)})`,
    {
      operation,
      stage: PopbillErrorStage.ValidateInput,
    }
  )
}
