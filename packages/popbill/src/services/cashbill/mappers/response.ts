import type * as Spec from '@connextable/popbill-spec'
import type * as Types from '../types'
import { compact, optionalObject } from './document'

export function mapCashbillOperationResult(value: Spec.CashbillApiResponseBase): Types.CashbillOperationResult {
  return { resultCode: value.code, resultMessage: value.message }
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
    submittedCount: optionalNumber(value.submitCount),
    successCount: optionalNumber(value.successCount),
    failureCount: optionalNumber(value.failCount),
    processingStateCode: value.txState,
    processingResultCode: optionalNumber(value.txResultCode),
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
    stateCode: optionalNumber(value.stateCode),
    stateMemo: value.stateMemo,
    nationalTaxServiceResultCode: value.ntsresultCode,
    nationalTaxServiceResultMessage: value.ntsresultMessage,
    isPrinted: optionalBoolean(value.printYN),
    isIssuedThroughAPI: optionalBoolean(value.interOPYN),
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
    cancellationReason: value.cancelType === undefined ? undefined : (Number(value.cancelType) as Types.CashbillCancellationReason),
    transactedAt: value.tradeDT,
    sendTextMessage: optionalBoolean(value.smssendYN),
    transactionDate: value.tradeDate,
    historyMemo: value.memo,
    emailSubject: value.emailSubject,
  })
}

export function mapCashbillSearchResult(value: Spec.CashbillSearchApiResponse): Types.CashbillSearchResult {
  return compact({
    operationResult: mapCashbillOperationResult(value),
    pageNumber: optionalNumber(value.pageNum),
    pageSize: optionalNumber(value.perPage),
    pageCount: optionalNumber(value.pageCount),
    totalCount: optionalNumber(value.total),
    cashbillSummaries: (value.list ?? []).map(mapCashbillInfo),
  })
}

export function mapCashbillLog(value: Spec.CashbillLogApiModel): Types.CashbillLogEntry {
  return compact({
    documentLogTypeCode: optionalNumber(value.docLogType),
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
  return compact({ emailTypeCode: value.emailType, sendEnabled: optionalBoolean(value.sendYN) })
}

export function mapCashbillChargeInfo(value: Spec.CashbillChargeInfoApiResponse): Types.CashbillChargeInfo {
  return compact({ unitCost: value.unitCost, chargeMethod: value.chargeMethod, rateSystem: value.rateSystem })
}

function optionalNumber(value: number | string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}
function optionalBoolean(value: boolean | string | undefined): boolean | undefined {
  return value === undefined ? undefined : value === true || value === 'true'
}
