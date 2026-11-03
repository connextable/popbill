import type * as Spec from '@connextable/popbill-spec'
import { removeUndefinedProperties } from '@connextable/popbill-utils'
import type { CashbillDocumentInput } from '../types'

export function mapCashbillDocument(document: CashbillDocumentInput): Spec.CashbillApiModel {
  return removeUndefinedProperties({
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
