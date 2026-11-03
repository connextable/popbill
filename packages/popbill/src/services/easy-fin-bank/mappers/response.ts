import type * as Spec from '@connextable/popbill-spec'
import { parseSafeInteger, preserveNumericCode } from '@connextable/popbill-utils'
import type * as Types from '../types'

export function mapOperation(value: Spec.EasyFinBankApiResponseBase): Types.EasyFinBankOperationResult {
  return { code: value.code, message: value.message }
}
export function mapChargeInfo(value: Spec.EasyFinBankChargeInfoApiModel): Types.EasyFinBankChargeInfo {
  return { unitCost: value.unitCost, chargeMethod: value.chargeMethod, rateSystem: value.rateSystem }
}

export function mapBankAccount(value: Spec.EasyFinBankAccountApiModel): Types.EasyFinBankAccount {
  return {
    bankCode: value.bankCode,
    accountNumber: value.accountNumber,
    accountName: value.accountName,
    accountType: value.accountType,
    memo: value.memo,
    accountStateCode: value.state,
    subscriptionStateCode: value.contractState,
    isClosureRequested: value.closeRequestYN,
    isUseRestricted: value.useRestrictYN,
    closesOnExpiration: value.closeOnExpired,
    hasUnpaidBalance: value.unPaidYN,
    subscriptionRenewalDay: value.baseDate,
    registeredAt: value.regDT,
    subscriptionStartedAt: value.contractDT,
    subscriptionExpiresOn: value.useEndDate,
  }
}

export function mapSubscription(value: Spec.EasyFinBankFlatRateApiModel): Types.EasyFinBankSubscription {
  return {
    accountReferenceId: value.referenceID,
    stateCode: value.state,
    isClosureRequested: value.closeRequestYN,
    isUseRestricted: value.useRestrictYN,
    closesOnExpiration: value.closeOnExpired,
    hasUnpaidBalance: value.unPaidYN,
    renewalDay: value.baseDate,
    startedAt: value.contractDT,
    expiresOn: value.useEndDate,
  }
}

export function mapCollectionStatus(value: Spec.EasyFinBankJobStateApiModel): Types.EasyFinBankCollectionStatus {
  const stateCode = preserveNumericCode(value.jobState)
  return {
    collectionId: value.jobID,
    startDate: value.startDate,
    endDate: value.endDate,
    stateCode,
    resultCode: value.errorCode,
    resultMessage: value.errorReason,
    isSuccessful: stateCode === 3 && parseSafeInteger(value.errorCode) === 1,
    requestedAt: value.regDT,
    startedAt: value.jobStartDT,
    completedAt: value.jobEndDT,
  }
}

export function mapTransaction(value: Spec.EasyFinBankTransactionApiModel): Types.EasyFinBankTransaction {
  return {
    transactionId: value.tid,
    transactionSequence: value.trserial,
    depositAmount: value.accIn,
    withdrawalAmount: value.accOut,
    balance: value.balance,
    remark1: value.remark1,
    remark2: value.remark2,
    remark3: value.remark3,
    remark4: value.remark4,
    memo: value.memo,
    transactionDate: value.trdate,
    transactedAt: value.trdt,
    registeredAt: value.regDT,
  }
}

export function mapSearchResult(value: Spec.EasyFinBankSearchResultApiModel): Types.EasyFinBankTransactionSearchResult {
  return {
    ...mapOperation(value),
    balance: value.balance,
    pageNumber: value.pageNum,
    pageSize: value.perPage,
    pageCount: value.pageCount,
    totalCount: value.total,
    transactions: value.list.map(mapTransaction),
    lastCollectedAt: value.lastScrapDT,
  }
}

export function mapSummary(value: Spec.EasyFinBankSummaryApiModel): Types.EasyFinBankTransactionSummary {
  return {
    transactionCount: value.count,
    depositCount: value.cntAccIn,
    withdrawalCount: value.cntAccOut,
    totalDepositAmount: value.totalAccIn,
    totalWithdrawalAmount: value.totalAccOut,
  }
}
