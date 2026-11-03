import type * as Spec from '@connextable/popbill-spec'
import {
  compactOptionalObject,
  optionalResponseNumber,
  preserveBooleanResponse,
  preserveNumericCode,
  removeUndefinedProperties,
} from '@connextable/popbill-utils'
import type * as Types from '../types'

export function mapCashbillOperationResult(value: Spec.CashbillApiResponseBase): Types.CashbillOperationResult {
  return { resultCode: preserveNumericCode(value.code), resultMessage: value.message }
}

export function mapCashbillIssueResult(value: Spec.CashbillIssueResultApiModel): Types.CashbillIssueResult {
  return removeUndefinedProperties({
    ...mapCashbillOperationResult(value),
    confirmationNumber: value.confirmNum,
    transactionDate: value.tradeDate,
    transactedAt: value.tradeDT,
    issuedAt: value.issueDT,
  })
}

export function mapCashbillBulkSubmissionResult(value: Spec.CashbillBulkSubmitApiResponse): Types.CashbillBulkSubmissionResult {
  return removeUndefinedProperties({ ...mapCashbillOperationResult(value), receiptIdentifier: value.receiptID })
}

export function mapCashbillBulkResult(value: Spec.CashbillGetBulkResultApiResponse): Types.CashbillBulkResult {
  return removeUndefinedProperties({
    ...mapCashbillOperationResult(value),
    submissionIdentifier: value.submitID,
    receiptIdentifier: value.receiptID,
    submittedCount: optionalResponseNumber(value.submitCount),
    successCount: optionalResponseNumber(value.successCount),
    failureCount: optionalResponseNumber(value.failCount),
    processingStateCode: preserveNumericCode(value.txState),
    processingResultCode: preserveNumericCode(value.txResultCode),
    issueResults: (value.issueResult ?? []).map((result) =>
      removeUndefinedProperties({ ...mapCashbillIssueResult(result), managementKey: result.mgtKey })
    ),
    receivedAt: value.receiptDT,
    processingStartedAt: value.txStartDT,
    processingCompletedAt: value.txEndDT,
  })
}

export function mapCashbillInfo(value: Spec.CashbillInfoApiModel): Types.CashbillInfo {
  return removeUndefinedProperties({
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
  return removeUndefinedProperties({
    managementKey: value.mgtKey,
    confirmationNumber: value.confirmNum,
    transactionType: value.tradeType,
    usageType: value.tradeUsage,
    tradeOption: value.tradeOpt,
    taxType: value.taxationType,
    merchant: compactOptionalObject({
      businessNumber: value.franchiseCorpNum,
      taxRegistrationIdentifier: value.franchiseTaxRegID,
      companyName: value.franchiseCorpName,
      chiefExecutiveOfficerName: value.franchiseCEOName,
      address: value.franchiseAddr,
      telephoneNumber: value.franchiseTEL,
    }),
    buyer: compactOptionalObject({
      identificationNumber: value.identityNum,
      customerName: value.customerName,
      emailAddress: value.email,
      mobilePhoneNumber: value.hp,
    }),
    payment: compactOptionalObject({
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
  return removeUndefinedProperties({
    operationResult: mapCashbillOperationResult(value),
    pageNumber: optionalResponseNumber(value.pageNum),
    pageSize: optionalResponseNumber(value.perPage),
    pageCount: optionalResponseNumber(value.pageCount),
    totalCount: optionalResponseNumber(value.total),
    cashbillSummaries: (value.list ?? []).map(mapCashbillInfo),
  })
}

export function mapCashbillLog(value: Spec.CashbillLogApiModel): Types.CashbillLogEntry {
  return removeUndefinedProperties({
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
  return removeUndefinedProperties({ emailTypeCode: value.emailType, sendEnabled: preserveBooleanResponse(value.sendYN) })
}

export function mapCashbillChargeInfo(value: Spec.CashbillChargeInfoApiResponse): Types.CashbillChargeInfo {
  return removeUndefinedProperties({ unitCost: value.unitCost, chargeMethod: value.chargeMethod, rateSystem: value.rateSystem })
}
