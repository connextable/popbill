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
import type { TaxInvoiceService } from './types'
import type { TaxInvoiceSearchCloseDownState } from '@connextable/popbill-spec'
import type { TaxinvoicePromiseService as CompatTaxInvoiceService } from '@connextable/popbill-compat/factory'
import type { PopbillApiError } from '@/errors'

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
    issueInvoiceImmediately(request, _options) {
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

    submitBulkIssue(request, _options) {
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

    getBulkIssueSubmissionResult(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBulkIssueSubmissionResult', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getBulkResult(
          request.businessNumber,
          request.submissionIdentifier,
          input.defaultUserId
        )

        return mapTaxInvoiceBulkIssueSubmissionResult(taxInvoiceApiResponse)
      })
    },

    registerInvoice(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.registerInvoice', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.register(
          request.businessNumber,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    updateInvoice(request, _options) {
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

    issueInvoice(request, _options) {
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

    cancelIssuedInvoice(request, _options) {
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

    requestReverseIssueImmediately(request, _options) {
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

    requestReverseIssue(request, _options) {
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

    cancelReverseIssueRequest(request, _options) {
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

    refuseReverseIssueRequest(request, _options) {
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

    deleteInvoice(request, _options) {
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

    sendInvoiceToNTS(request, _options) {
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

    async getInvoiceInfo(request, _options) {
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

    getInvoicesInfo(request, _options) {
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

    getInvoiceDetailInfo(request, _options) {
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

    checkInvoiceManagementKeyInUse(request, _options) {
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

    getInvoiceXML(request, _options) {
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

    searchInvoices(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.searchInvoices', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.search(
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
          input.defaultUserId,
          request.issueTypeCodes,
          request.registrationTypeCodes,
          mapSearchCloseDownStateCodes(request.closeDownStateCodes),
          request.invoiceManagementKeyOrNationalTaxServiceConfirmationNumber
        )

        return mapTaxInvoiceSearchResult(taxInvoiceApiResponse)
      })
    },

    getInvoiceLogs(request, _options) {
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

    getTaxInvoiceBoxURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxInvoiceBoxURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getURL(
          request.businessNumber,
          request.taxInvoiceBoxScope,
          input.defaultUserId
        )

        return mapTaxInvoiceAccessUrlFromString(taxInvoiceApiResponse)
      })
    },

    getInvoicePopupURL(request, _options) {
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

    getInvoiceViewURL(request, _options) {
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

    getSupplierInvoicePrintURL(request, _options) {
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

    getBuyerInvoicePrintURL(request, _options) {
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

    getBulkInvoicePrintURL(request, _options) {
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

    getInvoiceMailURL(request, _options) {
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

    getInvoicePDFURL(request, _options) {
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

    getSealAndAttachmentRegistrationURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSealAndAttachmentRegistrationURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getSealURL(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceAccessUrl(taxInvoiceApiResponse)
      })
    },

    attachFileFromPath(request, _options) {
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

    attachFileFromBinary(request, _options) {
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

    deleteAttachedFile(request, _options) {
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

    getAttachedFiles(request, _options) {
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

    resendInvoiceEmail(request, _options) {
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

    resendInvoiceSMS(request, _options) {
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

    resendInvoiceFAX(request, _options) {
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

    attachInvoiceStatement(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachInvoiceStatement', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.attachStatement(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.statementItemCode,
          request.statementManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    detachInvoiceStatement(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.detachInvoiceStatement', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.detachStatement(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.statementItemCode,
          request.statementManagementKey,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    assignInvoiceManagementKey(request, _options) {
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

    getEmailSendSettings(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getEmailSendSettings', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.listEmailConfig(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceEmailSendSettings(taxInvoiceApiResponse)
      })
    },

    updateEmailSendSettings(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.updateEmailSendSettings', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.updateEmailConfig(
          request.businessNumber,
          request.emailType,
          request.sendEnabled,
          input.defaultUserId
        )

        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    getSendToNTSSettings(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSendToNTSSettings', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getSendToNTSConfig(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceSendToNationalTaxServiceSetting(taxInvoiceApiResponse)
      })
    },

    getTaxCertificateRegistrationURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateRegistrationURL', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getTaxCertURL(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceAccessUrl(taxInvoiceApiResponse)
      })
    },

    getTaxCertificateExpirationDate(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateExpirationDate', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.getCertificateExpireDate(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceTaxCertificateExpiration(taxInvoiceApiResponse)
      })
    },

    checkTaxCertificateValidation(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.checkTaxCertificateValidation', async () => {
        const taxInvoiceApiResponse = await compatTaxInvoiceService.checkCertValidation(
          request.businessNumber,
          input.defaultUserId
        )
        return mapTaxInvoiceOperationResult(taxInvoiceApiResponse)
      })
    },

    getTaxCertificateInfo(request, _options) {
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

/**
 * 검색조건의 휴폐업상태 코드를 compat 입력 형식(`0 | 1 | 2 | 3 | 4`)으로 정규화합니다.
 */
function mapSearchCloseDownStateCodes(
  closeDownStateCodes: TaxInvoiceSearchCloseDownState[] | undefined
): (0 | 1 | 2 | 3 | 4)[] | undefined {
  if (!closeDownStateCodes) {
    return undefined
  }

  const normalizedCloseDownStateCodes = closeDownStateCodes
    .map((code) => Number(code))
    .filter((code): code is 0 | 1 | 2 | 3 | 4 => code === 0 || code === 1 || code === 2 || code === 3 || code === 4)

  return normalizedCloseDownStateCodes.length > 0 ? normalizedCloseDownStateCodes : undefined
}
