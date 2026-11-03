import type { CashbillPromiseService as CompatCashbillService } from '@connextable/popbill-compat/factory'
import { createInputValidationError } from '@connextable/popbill-compat/errors'
import { isValidCalendarDate8 } from '@connextable/popbill-utils'
import { PopbillErrorStage, type PopbillApiError } from '@/errors'
import { invokeCashbillMethod } from './adapters/error'
import { mapCashbillDocument } from './mappers/document'
import * as mappers from './mappers/response'
import * as types from './types'

interface CreateCashbillServiceInput {
  compatCashbillService: CompatCashbillService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}

export function createCashbillService(input: CreateCashbillServiceInput): types.CashbillService {
  const compat = input.compatCashbillService
  const userId = input.defaultUserId
  const invoke = <T>(method: keyof types.CashbillService, handler: () => Promise<T>) => invokeCashbillMethod(input, `cashbill.${method}`, handler)
  return {
    issueCashbillImmediately(request) {
      return invoke('issueCashbillImmediately', async () =>
        mappers.mapCashbillIssueResult(
          await compat.registIssue(request.businessNumber, mapCashbillDocument(request.document), request.historyMemo, userId, request.emailSubject)
        )
      )
    },
    revokeCashbill(request) {
      return invoke('revokeCashbill', async () => {
        validateRevocation(request, 'revokeCashbill')
        return mappers.mapCashbillIssueResult(
          await compat.revokeRegistIssue(
            request.businessNumber,
            request.managementKey,
            request.originalConfirmationNumber,
            request.originalTransactionDate,
            request.sendTextMessage,
            request.historyMemo,
            userId,
            request.partialCancellation,
            request.cancellationReason,
            request.payment?.supplyCostAmount,
            request.payment?.taxAmount,
            request.payment?.serviceFeeAmount,
            request.payment?.totalAmount,
            request.emailSubject,
            request.transactedAt
          )
        )
      })
    },
    submitCashbills(request) {
      return invoke('submitCashbills', async () =>
        mappers.mapCashbillBulkSubmissionResult(
          await compat.bulkSubmit(
            request.businessNumber,
            request.submissionIdentifier,
            request.documents.map((document) => ({
              ...mapCashbillDocument(document),
              memo: request.historyMemo,
              emailSubject: request.emailSubject,
            })),
            userId
          )
        )
      )
    },
    getCashbillBulkResult(request) {
      return invoke('getCashbillBulkResult', async () =>
        mappers.mapCashbillBulkResult(await compat.getBulkResult(request.businessNumber, request.submissionIdentifier, userId))
      )
    },
    registerCashbill(request) {
      return invoke('registerCashbill', async () =>
        mappers.mapCashbillOperationResult(await compat.register(request.businessNumber, mapCashbillDocument(request.document), userId))
      )
    },
    registerCashbillRevocation(request) {
      return invoke('registerCashbillRevocation', async () => {
        validateRevocation(request, 'registerCashbillRevocation')
        return mappers.mapCashbillOperationResult(
          await compat.revokeRegister(
            request.businessNumber,
            request.managementKey,
            request.originalConfirmationNumber,
            request.originalTransactionDate,
            request.sendTextMessage,
            userId,
            request.partialCancellation,
            request.cancellationReason,
            request.payment?.supplyCostAmount,
            request.payment?.taxAmount,
            request.payment?.serviceFeeAmount,
            request.payment?.totalAmount
          )
        )
      })
    },
    updateCashbill(request) {
      return invoke('updateCashbill', async () =>
        mappers.mapCashbillOperationResult(
          await compat.update(request.businessNumber, request.managementKey, mapCashbillDocument(request.document), userId)
        )
      )
    },
    issueCashbill(request) {
      return invoke('issueCashbill', async () =>
        mappers.mapCashbillIssueResult(await compat.issue(request.businessNumber, request.managementKey, request.historyMemo, userId))
      )
    },
    cancelIssuedCashbill(request) {
      return invoke('cancelIssuedCashbill', async () =>
        mappers.mapCashbillOperationResult(await compat.cancelIssue(request.businessNumber, request.managementKey, request.historyMemo, userId))
      )
    },
    deleteCashbill(request) {
      return invoke('deleteCashbill', async () =>
        mappers.mapCashbillOperationResult(await compat.delete(request.businessNumber, request.managementKey, userId))
      )
    },
    getCashbillInfo(request) {
      return invoke('getCashbillInfo', async () =>
        mappers.mapCashbillInfo(await compat.getInfo(request.businessNumber, request.managementKey, userId))
      )
    },
    getCashbillsInfo(request) {
      return invoke('getCashbillsInfo', async () =>
        (await compat.getInfos(request.businessNumber, [...request.managementKeys], userId)).map(mappers.mapCashbillInfo)
      )
    },
    getCashbillDetailInfo(request) {
      return invoke('getCashbillDetailInfo', async () =>
        mappers.mapCashbillDocumentOutput(await compat.getDetailInfo(request.businessNumber, request.managementKey, userId))
      )
    },
    checkCashbillManagementKeyInUse(request) {
      return invoke('checkCashbillManagementKeyInUse', async () => ({
        isInUse: await compat.checkMgtKeyInUse(request.businessNumber, request.managementKey, userId),
      }))
    },
    searchCashbills(request) {
      return invoke('searchCashbills', async () => {
        validateSearch(request)
        return mappers.mapCashbillSearchResult(
          await compat.search(
            request.businessNumber,
            request.searchDateType,
            request.startDate,
            request.endDate,
            [...(request.stateCodes ?? [])],
            [...(request.transactionTypes ?? [])],
            [...(request.usageTypes ?? [])],
            [...(request.tradeOptions ?? [])],
            [...(request.taxTypes ?? [])],
            request.queryText ?? '',
            request.sortOrder ?? 'D',
            request.pageNumber ?? 1,
            request.pageSize ?? 100,
            request.merchantTaxRegistrationIdentifiers?.join(',') ?? '',
            userId
          )
        )
      })
    },
    getCashbillLogs(request) {
      return invoke('getCashbillLogs', async () =>
        (await compat.getLogs(request.businessNumber, request.managementKey, userId)).map(mappers.mapCashbillLog)
      )
    },
    getCashbillBoxURL(request) {
      return invoke('getCashbillBoxURL', async () =>
        mappers.mapCashbillAccessUrl(await compat.getURL(request.businessNumber, request.cashbillBoxScope, userId))
      )
    },
    getCashbillPopupURL(request) {
      return invoke('getCashbillPopupURL', async () =>
        mappers.mapCashbillAccessUrl(await compat.getPopUpURL(request.businessNumber, request.managementKey, userId))
      )
    },
    getCashbillViewURL(request) {
      return invoke('getCashbillViewURL', async () =>
        mappers.mapCashbillAccessUrl(await compat.getViewURL(request.businessNumber, request.managementKey, userId))
      )
    },
    getCashbillPrintURL(request) {
      return invoke('getCashbillPrintURL', async () =>
        mappers.mapCashbillAccessUrl(await compat.getPrintURL(request.businessNumber, request.managementKey, userId))
      )
    },
    getReceiverCashbillPrintURL(request) {
      return invoke('getReceiverCashbillPrintURL', async () =>
        mappers.mapCashbillAccessUrl(await compat.getEPrintURL(request.businessNumber, request.managementKey, userId))
      )
    },
    getBulkCashbillPrintURL(request) {
      return invoke('getBulkCashbillPrintURL', async () =>
        mappers.mapCashbillAccessUrl(await compat.getMassPrintURL(request.businessNumber, [...request.managementKeys], userId))
      )
    },
    getCashbillMailURL(request) {
      return invoke('getCashbillMailURL', async () =>
        mappers.mapCashbillAccessUrl(await compat.getMailURL(request.businessNumber, request.managementKey, userId))
      )
    },
    getCashbillPDFURL(request) {
      return invoke('getCashbillPDFURL', async () =>
        mappers.mapCashbillAccessUrl(await compat.getPDFURL(request.businessNumber, request.managementKey, userId))
      )
    },
    downloadCashbillPDF(request) {
      return invoke('downloadCashbillPDF', () => compat.getPDF(request.businessNumber, request.managementKey, userId))
    },
    resendCashbillEmail(request) {
      return invoke('resendCashbillEmail', async () =>
        mappers.mapCashbillOperationResult(
          await compat.sendEmail(request.businessNumber, request.managementKey, request.receiverEmailAddress, userId)
        )
      )
    },
    resendCashbillSMS(request) {
      return invoke('resendCashbillSMS', async () =>
        mappers.mapCashbillOperationResult(
          await compat.sendSMS(
            request.businessNumber,
            request.managementKey,
            request.senderPhoneNumber,
            request.receiverPhoneNumber,
            request.messageBody,
            userId
          )
        )
      )
    },
    resendCashbillFAX(request) {
      return invoke('resendCashbillFAX', async () =>
        mappers.mapCashbillOperationResult(
          await compat.sendFAX(request.businessNumber, request.managementKey, request.senderPhoneNumber, request.receiverPhoneNumber, userId)
        )
      )
    },
    assignCashbillManagementKey(request) {
      return invoke('assignCashbillManagementKey', async () =>
        mappers.mapCashbillOperationResult(await compat.assignMgtKey(request.businessNumber, request.itemKey, request.managementKey, userId))
      )
    },
    getEmailSendSettings(request) {
      return invoke('getEmailSendSettings', async () =>
        (await compat.listEmailConfig(request.businessNumber, userId)).map(mappers.mapCashbillEmailSendSetting)
      )
    },
    updateEmailSendSettings(request) {
      return invoke('updateEmailSendSettings', async () =>
        mappers.mapCashbillOperationResult(await compat.updateEmailConfig(request.businessNumber, request.emailTypeCode, request.sendEnabled, userId))
      )
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', async () => mappers.mapCashbillChargeInfo(await compat.getChargeInfo(request.businessNumber, userId)))
    },
    getUnitCost(request) {
      return invoke('getUnitCost', async () => ({ unitCost: await compat.getUnitCost(request.businessNumber) }))
    },
  }
}

function fail(message: string, operation: string): never {
  throw createInputValidationError(message, { operation: `cashbill.${operation}`, stage: PopbillErrorStage.ValidateInput })
}

function validateRevocation(request: types.RegisterCashbillRevocationInput, operation: 'revokeCashbill' | 'registerCashbillRevocation'): void {
  if (request.partialCancellation && !request.payment) fail('부분 취소에는 payment가 필요합니다.', operation)
}

function validateSearch(request: types.SearchCashbillsInput): void {
  const invalid = (message: string) => fail(message, 'searchCashbills')
  if (!Object.values(types.CashbillDateType).includes(request.searchDateType)) invalid('searchDateType이 올바르지 않습니다.')
  for (const [name, date] of [
    ['startDate', request.startDate],
    ['endDate', request.endDate],
  ]) {
    if (typeof date !== 'string' || !/^\d{8}$/.test(date)) invalid(`${name}는 yyyyMMdd 형식이어야 합니다.`)
    if (!isValidCalendarDate8(date!)) invalid(`${name}가 유효한 날짜가 아닙니다.`)
  }
  if (request.startDate > request.endDate) invalid('startDate는 endDate 이후일 수 없습니다.')
  if (request.sortOrder !== undefined && !Object.values(types.CashbillSortOrder).includes(request.sortOrder))
    invalid('sortOrder가 올바르지 않습니다.')
  if (request.pageNumber !== undefined && (!Number.isInteger(request.pageNumber) || request.pageNumber < 1))
    invalid('pageNumber는 1 이상의 정수여야 합니다.')
  if (request.pageSize !== undefined && (!Number.isInteger(request.pageSize) || request.pageSize < 1)) invalid('pageSize는 1 이상의 정수여야 합니다.')
}
