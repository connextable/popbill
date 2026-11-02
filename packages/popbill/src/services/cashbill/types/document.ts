export const CashbillTransactionTypes = { Approval: '승인거래', Cancellation: '취소거래' } as const
export type CashbillTransactionType = (typeof CashbillTransactionTypes)[keyof typeof CashbillTransactionTypes]
export const CashbillUsageTypes = { IncomeDeduction: '소득공제용', ProofOfPurchase: '지출증빙용' } as const
export type CashbillUsageType = (typeof CashbillUsageTypes)[keyof typeof CashbillUsageTypes]
export const CashbillTradeOptions = { General: '일반', Culture: '도서공연', PublicTransportation: '대중교통' } as const
export type CashbillTradeOption = (typeof CashbillTradeOptions)[keyof typeof CashbillTradeOptions]
export const CashbillTaxTypes = { Taxable: '과세', Exempt: '비과세' } as const
export type CashbillTaxType = (typeof CashbillTaxTypes)[keyof typeof CashbillTaxTypes]
export const CashbillCancellationReasons = { TransactionCancelled: 1, IssuedInError: 2, Other: 3 } as const
export type CashbillCancellationReason = (typeof CashbillCancellationReasons)[keyof typeof CashbillCancellationReasons]

export interface CashbillMerchantInput {
  businessNumber: string
  taxRegistrationIdentifier?: string
  companyName?: string
  chiefExecutiveOfficerName?: string
  address?: string
  telephoneNumber?: string
}

export interface CashbillBuyerInput {
  /** 휴대폰·주민등록·사업자·현금영수증 카드 식별번호입니다. */
  identificationNumber: string
  customerName?: string
  emailAddress?: string
  mobilePhoneNumber?: string
}

/** 금액을 반올림하거나 숫자로 변환하지 않습니다. */
export interface CashbillPaymentInput {
  totalAmount: string
  supplyCostAmount: string
  taxAmount: string
  serviceFeeAmount: string
}

export interface CashbillDocumentInput {
  managementKey: string
  transactionType: CashbillTransactionType
  usageType: CashbillUsageType
  tradeOption?: CashbillTradeOption
  taxType: CashbillTaxType
  merchant: CashbillMerchantInput
  buyer: CashbillBuyerInput
  payment: CashbillPaymentInput
  itemName?: string
  orderNumber?: string
  originalConfirmationNumber?: string
  originalTransactionDate?: string
  cancellationReason?: CashbillCancellationReason
  /** yyyyMMddHHmmss. 생략 시 서버의 발행일시를 사용합니다. */
  transactedAt?: string
  sendTextMessage?: boolean
}

/** 승인 즉시발행과 초대량 발행은 승인거래 문서만 받습니다. */
export interface CashbillApprovalDocumentInput extends CashbillDocumentInput {
  transactionType: '승인거래'
}
