import { invokeTaxInvoiceMethod } from './adapters/error'
import { mapTaxInvoiceDocument, mapTaxInvoiceDocuments } from './mappers/document'
import { mapTaxInvoiceInfo } from './mappers/invoice-info'
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
      return invokeTaxInvoiceMethod(input, 'taxInvoice.issueInvoiceImmediately', async () =>
        compatTaxInvoiceService.registIssue(
          request.businessNumber,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          request.writeSpecification,
          request.forceIssue,
          request.historyMemo,
          request.emailSubject,
          request.dealInvoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    submitBulkIssue(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.submitBulkIssue', async () =>
        compatTaxInvoiceService.bulkSubmit(
          request.businessNumber,
          request.submissionIdentifier,
          mapTaxInvoiceDocuments(request.taxInvoiceDocuments),
          request.forceIssue,
          input.defaultUserId
        )
      )
    },

    getBulkIssueSubmissionResult(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBulkIssueSubmissionResult', async () =>
        compatTaxInvoiceService.getBulkResult(request.businessNumber, request.submissionIdentifier, input.defaultUserId)
      )
    },

    registerInvoice(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.registerInvoice', async () =>
        compatTaxInvoiceService.register(
          request.businessNumber,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          input.defaultUserId
        )
      )
    },

    updateInvoice(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.updateInvoice', async () =>
        compatTaxInvoiceService.update(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          input.defaultUserId
        )
      )
    },

    issueInvoice(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.issueInvoice', async () =>
        compatTaxInvoiceService.issue(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          request.emailSubject,
          request.forceIssue,
          input.defaultUserId
        )
      )
    },

    cancelIssuedInvoice(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.cancelIssuedInvoice', async () =>
        compatTaxInvoiceService.cancelIssue(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          input.defaultUserId
        )
      )
    },

    requestReverseIssueImmediately(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.requestReverseIssueImmediately', async () =>
        compatTaxInvoiceService.registRequest(
          request.businessNumber,
          mapTaxInvoiceDocument(request.taxInvoiceDocument),
          request.historyMemo,
          input.defaultUserId
        )
      )
    },

    requestReverseIssue(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.requestReverseIssue', async () =>
        compatTaxInvoiceService.request(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          input.defaultUserId
        )
      )
    },

    cancelReverseIssueRequest(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.cancelReverseIssueRequest', async () =>
        compatTaxInvoiceService.cancelRequest(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          input.defaultUserId
        )
      )
    },

    refuseReverseIssueRequest(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.refuseReverseIssueRequest', async () =>
        compatTaxInvoiceService.refuse(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.historyMemo,
          input.defaultUserId
        )
      )
    },

    deleteInvoice(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.deleteInvoice', async () =>
        compatTaxInvoiceService.delete(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    sendInvoiceToNTS(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.sendInvoiceToNTS', async () =>
        compatTaxInvoiceService.sendToNTS(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
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
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicesInfo', async () =>
        compatTaxInvoiceService.getInfos(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKeys,
          input.defaultUserId
        )
      )
    },

    getInvoiceDetailInfo(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceDetailInfo', async () =>
        compatTaxInvoiceService.getDetailInfo(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    checkInvoiceManagementKeyInUse(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.checkInvoiceManagementKeyInUse', async () =>
        compatTaxInvoiceService.checkMgtKeyInUse(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getInvoiceXML(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceXML', async () =>
        compatTaxInvoiceService.getXML(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    searchInvoices(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.searchInvoices', async () =>
        compatTaxInvoiceService.search(
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
      )
    },

    getInvoiceLogs(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceLogs', async () =>
        compatTaxInvoiceService.getLogs(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getTaxInvoiceBoxURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxInvoiceBoxURL', async () =>
        compatTaxInvoiceService.getURL(request.businessNumber, request.taxInvoiceBoxScope, input.defaultUserId)
      )
    },

    getInvoicePopupURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicePopupURL', async () =>
        compatTaxInvoiceService.getPopUpURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getInvoiceViewURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceViewURL', async () =>
        compatTaxInvoiceService.getViewURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getSupplierInvoicePrintURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSupplierInvoicePrintURL', async () =>
        compatTaxInvoiceService.getPrintURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getBuyerInvoicePrintURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBuyerInvoicePrintURL', async () =>
        compatTaxInvoiceService.getEPrintURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getBulkInvoicePrintURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getBulkInvoicePrintURL', async () =>
        compatTaxInvoiceService.getMassPrintURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKeys,
          input.defaultUserId
        )
      )
    },

    getInvoiceMailURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoiceMailURL', async () =>
        compatTaxInvoiceService.getMailURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getInvoicePDFURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getInvoicePDFURL', async () =>
        compatTaxInvoiceService.getPDFURL(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getSealAndAttachmentRegistrationURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSealAndAttachmentRegistrationURL', async () =>
        compatTaxInvoiceService.getSealURL(request.businessNumber, input.defaultUserId)
      )
    },

    attachFileFromPath(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachFileFromPath', async () =>
        compatTaxInvoiceService.attachFile(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.displayName,
          request.filePath,
          input.defaultUserId
        )
      )
    },

    attachFileFromBinary(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachFileFromBinary', async () =>
        compatTaxInvoiceService.attachFileBinary(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          {
            fileName: request.fileName,
            fileData: request.fileData,
          },
          input.defaultUserId
        )
      )
    },

    deleteAttachedFile(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.deleteAttachedFile', async () =>
        compatTaxInvoiceService.deleteFile(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.fileIdentifier,
          input.defaultUserId
        )
      )
    },

    getAttachedFiles(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getAttachedFiles', async () =>
        compatTaxInvoiceService.getFiles(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    resendInvoiceEmail(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceEmail', async () =>
        compatTaxInvoiceService.sendEmail(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.receiverEmailAddress,
          input.defaultUserId
        )
      )
    },

    resendInvoiceSMS(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceSMS', async () =>
        compatTaxInvoiceService.sendSMS(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.senderPhoneNumber,
          request.receiverPhoneNumber,
          request.messageBody,
          input.defaultUserId
        )
      )
    },

    resendInvoiceFAX(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.resendInvoiceFAX', async () =>
        compatTaxInvoiceService.sendFAX(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.senderNumber,
          request.receiverNumber,
          input.defaultUserId
        )
      )
    },

    attachInvoiceStatement(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.attachInvoiceStatement', async () =>
        compatTaxInvoiceService.attachStatement(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.statementItemCode,
          request.statementManagementKey,
          input.defaultUserId
        )
      )
    },

    detachInvoiceStatement(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.detachInvoiceStatement', async () =>
        compatTaxInvoiceService.detachStatement(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.invoiceManagementKey,
          request.statementItemCode,
          request.statementManagementKey,
          input.defaultUserId
        )
      )
    },

    assignInvoiceManagementKey(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.assignInvoiceManagementKey', async () =>
        compatTaxInvoiceService.assignMgtKey(
          request.businessNumber,
          request.invoiceDocumentKeyType,
          request.itemKey,
          request.invoiceManagementKey,
          input.defaultUserId
        )
      )
    },

    getEmailSendSettings(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getEmailSendSettings', async () =>
        compatTaxInvoiceService.listEmailConfig(request.businessNumber, input.defaultUserId)
      )
    },

    updateEmailSendSettings(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.updateEmailSendSettings', async () =>
        compatTaxInvoiceService.updateEmailConfig(
          request.businessNumber,
          request.emailType,
          request.sendEnabled,
          input.defaultUserId
        )
      )
    },

    getSendToNTSSettings(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getSendToNTSSettings', async () =>
        compatTaxInvoiceService.getSendToNTSConfig(request.businessNumber, input.defaultUserId)
      )
    },

    getTaxCertificateRegistrationURL(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateRegistrationURL', async () =>
        compatTaxInvoiceService.getTaxCertURL(request.businessNumber, input.defaultUserId)
      )
    },

    getTaxCertificateExpirationDate(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateExpirationDate', async () =>
        compatTaxInvoiceService.getCertificateExpireDate(request.businessNumber, input.defaultUserId)
      )
    },

    checkTaxCertificateValidation(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.checkTaxCertificateValidation', async () =>
        compatTaxInvoiceService.checkCertValidation(request.businessNumber, input.defaultUserId)
      )
    },

    getTaxCertificateInfo(request, _options) {
      return invokeTaxInvoiceMethod(input, 'taxInvoice.getTaxCertificateInfo', async () =>
        compatTaxInvoiceService.getTaxCertInfo(request.businessNumber, input.defaultUserId)
      )
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
