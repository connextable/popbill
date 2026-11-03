import type * as Spec from '@connextable/popbill-spec'
import { preserveNumericCode } from '@/internal/collection-state'
import { optionalResponseNumber, preserveBooleanResponse } from '@/internal/response'
import type * as Types from '../types'
import { compact, optionalObject } from './document'

export function mapCashbillOperationResult(value: Spec.CashbillApiResponseBase): Types.CashbillOperationResult {
  return { resultCode: preserveNumericCode(value.code), resultMessage: value.message }
}

export function mapCashbillIssueResult(value: Spec.CashbillIssueResultApiModel): Types.CashbillIssueResult {
  return compact({
    ...mapCashbillOperationResult(value),
    confirmationNumber: value.confirmNum,
    transactionDate: value.tradeDate,
    transactedAt: value.tradeDT,
    issuedAt: value.issueDT,
  })
}

export function mapCashbillBulkSubmissionResult(value: Spec.CashbillBulkSubmitApiResponse): Types.CashbillBulkSubmissionResult {
  return compact({ ...mapCashbillOperationResult(value), receiptIdentifier: value.receiptID })
}

export function mapCashbillBulkResult(value: Spec.CashbillGetBulkResultApiResponse): Types.CashbillBulkResult {
  return compact({
    ...mapCashbillOperationResult(value),
    submissionIdentifier: value.submitID,
    receiptIdentifier: value.receiptID,
    submittedCount: optionalResponseNumber(value.submitCount),
    successCount: optionalResponseNumber(value.successCount),
    failureCount: optionalResponseNumber(value.failCount),
    processingStateCode: preserveNumericCode(value.txState),
    processingResultCode: preserveNumericCode(value.txResultCode),
    issueResults: (value.issueResult ?? []).map((result) => compact({ ...mapCashbillIssueResult(result), managementKey: result.mgtKey })),
    receivedAt: value.receiptDT,
    processingStartedAt: value.txStartDT,
    processingCompletedAt: value.txEndDT,
  })
}

export function mapCashbillInfo(value: Spec.CashbillInfoApiModel): Types.CashbillInfo {
  return compact({
    ...mapCashbillDocumentOutput(value),
    itemKey: value.itemKey,
    stateCode: preserveNumericCode(value.stateCode),
    stateMemo: value.stateMemo,
    nationalTaxServiceResultCode: value.ntsresultCode,
    nationalTaxServiceResultMessage: value.ntsresultMessage,
    isPrinted: preserveBooleanResponse(value.printYN),
    isIssuedThroughAPI: preserveBooleanResponse(value.interOPYN),
    registeredAt: value.regDT,
    issuedAt: value.issueDT,
    stateChangedAt: value.stateDT,
    nationalTaxServiceSentAt: value.ntssendDT,
    nationalTaxServiceResultReceivedAt: value.ntsresultDT,
  })
}

export function mapCashbillDocumentOutput(value: Spec.CashbillApiModel): Types.CashbillDocumentOutput {
  return compact({
    managementKey: value.mgtKey,
    confirmationNumber: value.confirmNum,
    transactionType: value.tradeType,
    usageType: value.tradeUsage,
    tradeOption: value.tradeOpt,
    taxType: value.taxationType,
    merchant: optionalObject({
      businessNumber: value.franchiseCorpNum,
      taxRegistrationIdentifier: value.franchiseTaxRegID,
      companyName: value.franchiseCorpName,
      chiefExecutiveOfficerName: value.franchiseCEOName,
      address: value.franchiseAddr,
      telephoneNumber: value.franchiseTEL,
    }),
    buyer: optionalObject({
      identificationNumber: value.identityNum,
      customerName: value.customerName,
      emailAddress: value.email,
      mobilePhoneNumber: value.hp,
    }),
    payment: optionalObject({
      totalAmount: value.totalAmount,
      supplyCostAmount: value.supplyCost,
      taxAmount: value.tax,
      serviceFeeAmount: value.serviceFee,
    }),
    itemName: value.itemName,
    orderNumber: value.orderNumber,
    originalConfirmationNumber: value.orgConfirmNum,
    originalTransactionDate: value.orgTradeDate,
    cancellationReason: preserveNumericCode(value.cancelType),
    transactedAt: value.tradeDT,
    sendTextMessage: preserveBooleanResponse(value.smssendYN),
    transactionDate: value.tradeDate,
    historyMemo: value.memo,
    emailSubject: value.emailSubject,
  })
}

export function mapCashbillSearchResult(value: Spec.CashbillSearchApiResponse): Types.CashbillSearchResult {
  return compact({
    operationResult: mapCashbillOperationResult(value),
    pageNumber: optionalResponseNumber(value.pageNum),
    pageSize: optionalResponseNumber(value.perPage),
    pageCount: optionalResponseNumber(value.pageCount),
    totalCount: optionalResponseNumber(value.total),
    cashbillSummaries: (value.list ?? []).map(mapCashbillInfo),
  })
}

export function mapCashbillLog(value: Spec.CashbillLogApiModel): Types.CashbillLogEntry {
  return compact({
    documentLogTypeCode: preserveNumericCode(value.docLogType),
    logMessage: value.log,
    processTypeCode: value.procType,
    processCompanyName: value.procCorpName,
    processContactName: value.procContactName,
    processDescription: value.procMemo,
    registeredAt: value.regDT,
    ipAddress: value.ip,
  })
}

export function mapCashbillAccessUrl(accessUrl: string): Types.CashbillAccessUrl {
  return { accessUrl }
}

export function mapCashbillEmailSendSetting(value: Spec.CashbillEmailConfigApiModel): Types.CashbillEmailSendSetting {
  return compact({ emailTypeCode: value.emailType, sendEnabled: preserveBooleanResponse(value.sendYN) })
}

export function mapCashbillChargeInfo(value: Spec.CashbillChargeInfoApiResponse): Types.CashbillChargeInfo {
  return compact({ unitCost: value.unitCost, chargeMethod: value.chargeMethod, rateSystem: value.rateSystem })
}
