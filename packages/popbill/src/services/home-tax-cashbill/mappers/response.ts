import type * as Spec from '@connextable/popbill-spec'
import { parseSafeInteger } from '@connextable/popbill-utils'
import type * as Output from '../types/response'
import { preserveNumericCode } from '@/internal/collection-state'

export function mapCollectionJobState(raw: Spec.HomeTaxCashbillJobStateApiModel): Output.HomeTaxCashbillCollectionJobState {
  const stateCode = preserveNumericCode(raw.jobState)
  return {
    jobId: raw.jobID,
    receiptDirection: raw.queryType,
    dateType: raw.queryDateType,
    startDate: raw.queryStDate,
    endDate: raw.queryEnDate,
    stateCode,
    resultCode: raw.errorCode,
    resultMessage: raw.errorReason,
    collectedCount: raw.collectCount,
    collectionSucceeded: stateCode === 3 && parseSafeInteger(raw.errorCode) === 1,
    requestedAt: raw.regDT,
    startedAt: raw.jobStartDT,
    completedAt: raw.jobEndDT,
  }
}

export function mapCashbill(raw: Spec.HomeTaxCashbillApiModel): Output.HomeTaxCashbillReceipt {
  return {
    ntsConfirmationNumber: raw.ntsconfirmNum,
    receiptDirection: raw.invoiceType,
    tradeType: raw.tradeType,
    tradeUsage: raw.tradeUsage,
    franchiseBusinessNumber: raw.franchiseCorpNum,
    franchiseBusinessName: raw.franchiseCorpName,
    franchiseBusinessTypeCode: preserveNumericCode(raw.franchiseCorpType),
    maskedIdentityNumber: raw.identityNum,
    identityNumberTypeCode: preserveNumericCode(raw.identityNumType),
    customerName: raw.customerName,
    cardOwnerName: raw.cardOwnerName,
    deductionTypeCode: preserveNumericCode(raw.deductionType),
    supplyAmount: raw.supplyCost,
    taxAmount: raw.tax,
    serviceFeeAmount: raw.serviceFee,
    totalAmount: raw.totalAmount,
    tradeDate: raw.tradeDate,
    tradedAt: raw.tradeDT,
  }
}

export function mapSearchResult(raw: Spec.HomeTaxCashbillSearchApiResponse): Output.HomeTaxCashbillSearchResult {
  return {
    code: raw.code,
    message: raw.message,
    pageNumber: raw.pageNum,
    pageSize: raw.perPage,
    pageCount: raw.pageCount,
    totalCount: raw.total,
    receipts: (raw.list ?? []).map(mapCashbill),
  }
}

export function mapSummary(raw: Spec.HomeTaxCashbillSummaryApiResponse): Output.HomeTaxCashbillSummary {
  return {
    receiptCount: raw.count,
    supplyAmountTotal: raw.supplyCostTotal,
    taxAmountTotal: raw.taxTotal,
    serviceFeeAmountTotal: raw.serviceFeeTotal,
    totalAmount: raw.amountTotal,
  }
}

export function mapFlatRateState(raw: Spec.HomeTaxCashbillFlatRateStateApiModel): Output.HomeTaxCashbillFlatRateState {
  return {
    businessNumber: raw.referenceID,
    stateCode: raw.state,
    cancellationRequested: raw.closeRequestYN,
    useRestricted: raw.useRestrictYN,
    cancelOnExpiration: raw.closeOnExpired,
    hasUnpaidBalance: raw.unPaidYN,
    renewalPaymentDay: raw.baseDate,
    contractStartedAt: raw.contractDT,
    expiresOn: raw.useEndDate,
  }
}
