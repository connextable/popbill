import type * as Spec from '@connextable/popbill-spec'
import type { CashbillDocumentInput } from '../types'

export function compact<T extends object>(source: T): T {
  const result = { ...source }
  for (const key of Object.keys(result) as (keyof T)[]) if (result[key] === undefined) delete result[key]
  return result
}

export function optionalObject<T extends object>(source: T): T | undefined {
  const result = compact(source)
  return Object.keys(result).length > 0 ? result : undefined
}

export function mapCashbillDocument(document: CashbillDocumentInput): Spec.CashbillApiModel {
  return compact({
    mgtKey: document.managementKey,
    tradeDT: document.transactedAt,
    tradeType: document.transactionType,
    tradeUsage: document.usageType,
    tradeOpt: document.tradeOption,
    taxationType: document.taxType,
    totalAmount: document.payment.totalAmount,
    supplyCost: document.payment.supplyCostAmount,
    tax: document.payment.taxAmount,
    serviceFee: document.payment.serviceFeeAmount,
    franchiseCorpNum: document.merchant.businessNumber,
    franchiseTaxRegID: document.merchant.taxRegistrationIdentifier,
    franchiseCorpName: document.merchant.companyName,
    franchiseCEOName: document.merchant.chiefExecutiveOfficerName,
    franchiseAddr: document.merchant.address,
    franchiseTEL: document.merchant.telephoneNumber,
    identityNum: document.buyer.identificationNumber,
    customerName: document.buyer.customerName,
    itemName: document.itemName,
    orderNumber: document.orderNumber,
    email: document.buyer.emailAddress,
    hp: document.buyer.mobilePhoneNumber,
    smssendYN: document.sendTextMessage,
    orgConfirmNum: document.originalConfirmationNumber,
    orgTradeDate: document.originalTransactionDate,
    cancelType: document.cancellationReason,
  })
}
