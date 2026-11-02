/** 전자명세서 문서유형 코드입니다. */
export const StatementItemCodes = {
  TradeStatement: 121,
  Invoice: 122,
  Estimate: 123,
  PurchaseOrder: 124,
  Deposit: 125,
  Receipt: 126,
} as const

export type StatementItemCode = (typeof StatementItemCodes)[keyof typeof StatementItemCodes]

/** 전자명세서 영수/청구 구분입니다. */
export const StatementPurposeTypes = { Receipt: '영수', Claim: '청구', None: '없음' } as const
export type StatementPurposeType = (typeof StatementPurposeTypes)[keyof typeof StatementPurposeTypes]

/** 전자명세서 과세 유형입니다. */
export const StatementTaxationTypes = { Taxable: '과세', ZeroRated: '영세', Exempt: '면세' } as const
export type StatementTaxationType = (typeof StatementTaxationTypes)[keyof typeof StatementTaxationTypes]

/** 발신자 또는 수신자 정보입니다. 금액과 식별번호는 문자열 그대로 전송합니다. */
export interface StatementPartyInput {
  businessNumber?: string
  taxRegistrationIdentifier?: string
  companyName?: string
  chiefExecutiveOfficerName?: string
  address?: string
  businessType?: string
  businessClass?: string
  departmentName?: string
  contactName?: string
  telephoneNumber?: string
  mobilePhoneNumber?: string
  emailAddress?: string
  faxNumber?: string
}

export interface StatementPaymentSummaryInput {
  totalSupplyCostAmount?: string
  totalTaxAmount?: string
  totalAmount?: string
}

/** 맞춤양식 품목 추가필드 번호(spare1~spare20)입니다. */
export type StatementAdditionalFieldNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20

export interface StatementLineItemInput {
  lineNumber: number
  transactionDate?: string
  itemName?: string
  specification?: string
  quantity?: string
  unitCostAmount?: string
  supplyCostAmount?: string
  taxAmount?: string
  remark?: string
  additionalFields?: Partial<Record<StatementAdditionalFieldNumber, string>>
}

/** 6종 전자명세서의 공통 입력 문서입니다. */
export interface StatementDocumentInput {
  documentTypeCode: StatementItemCode
  managementKey?: string
  documentSerialNumber?: string
  formCode?: string
  writtenDate?: string
  taxType?: StatementTaxationType
  purposeType?: StatementPurposeType
  sender?: StatementPartyInput
  receiver?: StatementPartyInput
  paymentSummary?: StatementPaymentSummaryInput
  lineItems?: StatementLineItemInput[]
  remarkOne?: string
  remarkTwo?: string
  remarkThree?: string
  /** 문서 양식별 추가 속성입니다. 키와 값을 변경 없이 보존합니다. */
  propertyBag?: Record<string, string>
  includeBusinessLicenseImage?: boolean
  includeBankBookImage?: boolean
  sendTextMessage?: boolean
}
