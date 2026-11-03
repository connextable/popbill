import type * as Spec from '@connextable/popbill-spec'
import { removeUndefinedProperties } from '@connextable/popbill-utils'
import type * as Types from '../types'
export function operation(response: Spec.CommonOperationApiResponse): Types.CommonOperationResult {
  return { resultCode: response.code, resultMessage: response.message }
}
export function company(response: Spec.CommonCorpInfoApiModel): Types.CommonCompany {
  return {
    companyName: response.corpName,
    chiefExecutiveOfficerName: response.ceoname,
    address: response.addr,
    businessType: response.bizType,
    businessClass: response.bizClass,
  }
}
export function contact(response: Spec.CommonContactApiModel): Types.CommonContact {
  return removeUndefinedProperties({
    userId: response.id,
    personName: response.personName,
    phoneNumber: response.tel,
    emailAddress: response.email,
    searchRole: response.searchRole,
    isManager: response.mgrYN,
    stateCode: response.state,
    registeredAt: response.regDT,
  })
}
export function payment(response: Spec.CommonPaymentHistoryApiModel): Types.CommonPaymentHistory {
  return removeUndefinedProperties({
    productType: response.productType,
    productName: response.productName,
    paymentType: response.settleType,
    contactName: response.settlerName,
    contactEmailAddress: response.settlerEmail,
    paymentAmount: response.settleCost,
    chargedPoints: response.settlePoint,
    stateCode: response.settleState,
    registeredAt: response.regDT,
    stateChangedAt: response.stateDT,
  })
}
export function use(response: Spec.CommonUseHistoryApiModel): Types.CommonPointUseHistory {
  return removeUndefinedProperties({
    serviceCode: response.itemCode,
    serviceUserId: response.serviceUserID,
    userId: response.userID,
    userName: response.userName,
    transactionPoints: response.txPoint,
    remainingPoints: response.balance,
    transactionTypeCode: response.txType,
    transactedAt: response.txDT,
  })
}
export function refund(response: Spec.CommonRefundHistoryApiModel): Types.CommonRefundHistory {
  return removeUndefinedProperties({
    bankName: response.accountBank,
    accountNumber: response.accountNum,
    accountHolderName: response.accountName,
    requestedPoints: response.requestPoint,
    reason: response.reason,
    stateCode: response.state,
    requestedAt: response.reqDT,
  })
}
export function page<T, R>(response: Spec.CommonPageApiResponse<T>, mapper: (value: T) => R): Types.CommonHistoryResult<R> {
  return removeUndefinedProperties({
    resultCode: response.code,
    resultMessage: response.message,
    pageNumber: response.pageNum,
    pageSize: response.perPage,
    pageCount: response.pageCount,
    totalCount: response.total,
    items: response.list.map(mapper),
  })
}
