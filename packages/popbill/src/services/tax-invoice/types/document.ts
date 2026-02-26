import type { TaxInvoiceDateString } from '@connextable/popbill-spec'

/**
 * 세금계산서 과금 방향 값입니다.
 */
export const TaxInvoiceChargeDirectionValues = {
  /** 값: `정과금`, 의미: 공급자에게 과금되는 일반 방향 */
  NormalCharge: '정과금',
  /** 값: `역과금`, 의미: 공급받는자에게 과금되는 역방향 */
  ReverseCharge: '역과금',
} as const

/**
 * 세금계산서 과금 방향 타입입니다.
 */
export type TaxInvoiceChargeDirection =
  (typeof TaxInvoiceChargeDirectionValues)[keyof typeof TaxInvoiceChargeDirectionValues]

/**
 * 세금계산서 발행 형태 값입니다.
 */
export const TaxInvoiceIssueTypes = {
  /** 값: `정발행`, 의미: 공급자 중심의 일반 발행 */
  Normal: '정발행',
  /** 값: `역발행`, 의미: 공급받는자 요청 기반 발행 */
  Reverse: '역발행',
  /** 값: `위수탁`, 의미: 수탁자 대행 발행 */
  Trustee: '위수탁',
} as const

/**
 * 세금계산서 발행 형태 타입입니다.
 */
export type TaxInvoiceIssueType = (typeof TaxInvoiceIssueTypes)[keyof typeof TaxInvoiceIssueTypes]

/**
 * 세금계산서 영수/청구 값입니다.
 */
export const TaxInvoicePurposeTypes = {
  /** 값: `영수`, 의미: 영수 목적 */
  Receipt: '영수',
  /** 값: `청구`, 의미: 청구 목적 */
  Claim: '청구',
  /** 값: `없음`, 의미: 목적 구분 없음 */
  None: '없음',
} as const

/**
 * 세금계산서 영수/청구 타입입니다.
 */
export type TaxInvoicePurposeType = (typeof TaxInvoicePurposeTypes)[keyof typeof TaxInvoicePurposeTypes]

/**
 * 세금계산서 과세 유형 값입니다.
 */
export const TaxInvoiceTaxationTypes = {
  /** 값: `과세`, 의미: 일반 과세 */
  Taxable: '과세',
  /** 값: `영세`, 의미: 영세율 */
  ZeroRated: '영세',
  /** 값: `면세`, 의미: 면세 */
  Exempt: '면세',
} as const

/**
 * 세금계산서 과세 유형 타입입니다.
 */
export type TaxInvoiceTaxationType = (typeof TaxInvoiceTaxationTypes)[keyof typeof TaxInvoiceTaxationTypes]

/**
 * 공급받는자 구분 값입니다.
 */
export const TaxInvoiceRecipientTypes = {
  /** 값: `사업자`, 의미: 사업자 번호 기반 */
  Business: '사업자',
  /** 값: `개인`, 의미: 주민등록번호 기반 */
  Individual: '개인',
  /** 값: `외국인`, 의미: 외국인 식별번호 기반 */
  Foreigner: '외국인',
} as const

/**
 * 공급받는자 구분 타입입니다.
 */
export type TaxInvoiceRecipientType = (typeof TaxInvoiceRecipientTypes)[keyof typeof TaxInvoiceRecipientTypes]

/**
 * 공급받는자 휴폐업 상태 값입니다.
 */
export const TaxInvoiceBusinessStatusValues = {
  /** 값: `null`, 의미: 미확인 */
  NotChecked: null,
  /** 값: `0`, 의미: 미등록 */
  NotRegistered: 0,
  /** 값: `1`, 의미: 사업중 */
  Operating: 1,
  /** 값: `2`, 의미: 폐업 */
  Closed: 2,
  /** 값: `3`, 의미: 휴업 */
  Suspended: 3,
  /** 값: `4`, 의미: 확인실패 */
  CheckFailed: 4,
} as const

/**
 * 공급받는자 휴폐업 상태 타입입니다.
 */
export type TaxInvoiceBusinessStatus =
  (typeof TaxInvoiceBusinessStatusValues)[keyof typeof TaxInvoiceBusinessStatusValues]

/**
 * 수정세금계산서 사유코드 값입니다.
 */
export const TaxInvoiceModificationReasonCodes = {
  /** 값: `1`, 의미: 기재사항 착오 정정 */
  CorrectingEntryErrors: 1,
  /** 값: `2`, 의미: 공급가액 변동 */
  SupplyAmountAdjustment: 2,
  /** 값: `3`, 의미: 환입 */
  Return: 3,
  /** 값: `4`, 의미: 계약의 해제 */
  ContractCancellation: 4,
  /** 값: `5`, 의미: 내국신용장 사후 개설 */
  PostIssuedDomesticLetterOfCredit: 5,
  /** 값: `6`, 의미: 착오에 의한 이중 발급 */
  DuplicateIssuanceByMistake: 6,
} as const

/**
 * 수정세금계산서 사유코드 타입입니다.
 */
export type TaxInvoiceModificationReasonCode =
  (typeof TaxInvoiceModificationReasonCodes)[keyof typeof TaxInvoiceModificationReasonCodes]

/**
 * 세금계산서 상세 품목 입력입니다.
 */
export interface TaxInvoiceLineItemInput {
  /** 상세 품목의 순번입니다. */
  lineNumber: number
  /** 거래일자(yyyyMMdd)입니다. */
  transactionDate?: TaxInvoiceDateString
  /** 품목명입니다. */
  itemName?: string
  /** 규격입니다. */
  specification?: string
  /** 수량입니다. */
  quantity?: string
  /** 단가입니다. */
  unitCostAmount?: string
  /** 공급가액입니다. */
  supplyCostAmount?: string
  /** 세액입니다. */
  taxAmount?: string
  /** 품목 비고입니다. */
  remark?: string
}

/**
 * 세금계산서 추가 담당자 입력입니다.
 */
export interface TaxInvoiceAdditionalContactInput {
  /** 추가 담당자의 순번입니다. */
  sequenceNumber: number
  /** 추가 담당자 이름입니다. */
  contactName?: string
  /** 추가 담당자 이메일 주소입니다. */
  emailAddress: string
}

/**
 * 세금계산서 당사자 공통 입력입니다.
 */
export interface TaxInvoicePartyInput {
  /** 사업자번호입니다. */
  businessNumber?: string
  /** 문서 관리번호입니다. */
  managementKey?: string
  /** 종사업장 식별번호입니다. */
  taxRegistrationIdentifier?: string
  /** 상호입니다. */
  companyName?: string
  /** 대표자 성명입니다. */
  chiefExecutiveOfficerName?: string
  /** 주소입니다. */
  address?: string
  /** 업태입니다. */
  businessClass?: string
  /** 종목입니다. */
  businessType?: string
  /** 담당자 이름입니다. */
  contactName?: string
  /** 담당자 전화번호입니다. */
  telephoneNumber?: string
  /** 담당자 휴대폰번호입니다. */
  mobilePhoneNumber?: string
  /** 담당자 이메일 주소입니다. */
  emailAddress?: string
  /** 담당자 휴대폰 문자 발송 여부입니다. */
  sendTextMessage?: boolean
  /** 인쇄 여부입니다. */
  printEnabled?: boolean
  /** 주민등록번호입니다. */
  residentRegistrationNumber?: string
  /** 외국인 등록번호입니다. */
  foreignerRegistrationNumber?: string
  /** 종사업자번호입니다. */
  branchBusinessNumber?: string
  /** 종사업자 일련번호입니다. */
  branchSerialNumber?: string
  /** 법인 구분값입니다. */
  corporationClassification?: string
  /** 부서명입니다. */
  departmentName?: string
}

/**
 * 세금계산서 공급받는자 입력입니다.
 */
export interface TaxInvoiceBuyerInput extends TaxInvoicePartyInput {
  /** 공급받는자 구분입니다. */
  recipientType?: TaxInvoiceRecipientType
  /** 예비 담당자 이름입니다. */
  secondaryContactName?: string
  /** 예비 담당자 전화번호입니다. */
  secondaryTelephoneNumber?: string
  /** 예비 담당자 휴대폰번호입니다. */
  secondaryMobilePhoneNumber?: string
  /** 예비 담당자 이메일 주소입니다. */
  secondaryEmailAddress?: string
  /** 주 담당 부서명입니다. */
  primaryDepartmentName?: string
  /** 예비 담당 부서명입니다. */
  secondaryDepartmentName?: string
  /** 휴폐업 상태입니다. */
  businessStatus?: TaxInvoiceBusinessStatus
  /** 휴폐업일자(yyyyMMdd)입니다. */
  businessStatusDate?: TaxInvoiceDateString
}

/**
 * 세금계산서 결제/합계 금액 입력입니다.
 */
export interface TaxInvoicePaymentSummaryInput {
  /** 세액 합계입니다. */
  totalTaxAmount?: string
  /** 공급가액 합계입니다. */
  totalSupplyCostAmount?: string
  /** 합계 금액입니다. */
  totalAmount?: string
  /** 현금 금액입니다. */
  cashAmount?: string
  /** 수표 금액입니다. */
  checkAmount?: string
  /** 어음 금액입니다. */
  promissoryNoteAmount?: string
  /** 외상 금액입니다. */
  creditAmount?: string
}

/**
 * 세금계산서 수정 사유 입력입니다.
 */
export interface TaxInvoiceModificationInput {
  /** 수정 사유코드입니다. */
  modificationReasonCode?: TaxInvoiceModificationReasonCode
  /** 원본 문서의 국세청 승인번호입니다. */
  originalNationalTaxServiceConfirmationNumber?: string
}

/**
 * 세금계산서 문서 입력입니다.
 */
export interface TaxInvoiceDocumentInput {
  /** 거래명세서 동시작성 여부입니다. */
  writeSpecificationEnabled?: boolean
  /** 작성일자(yyyyMMdd)입니다. */
  writtenDate?: TaxInvoiceDateString
  /** 과금 방향입니다. */
  chargeDirection?: TaxInvoiceChargeDirection
  /** 발행 형태입니다. */
  issueType?: TaxInvoiceIssueType
  /** 영수/청구 구분입니다. */
  purposeType?: TaxInvoicePurposeType
  /** 발행시기 코드입니다. */
  issueTimingCode?: string
  /** 과세 유형입니다. */
  taxType?: TaxInvoiceTaxationType
  /** 공급자 정보입니다. */
  supplier?: TaxInvoicePartyInput
  /** 공급받는자 정보입니다. */
  buyer?: TaxInvoiceBuyerInput
  /** 수탁자 정보입니다. */
  trustee?: TaxInvoicePartyInput
  /** 금액 정보입니다. */
  paymentSummary?: TaxInvoicePaymentSummaryInput
  /** 수정세금계산서 정보입니다. */
  modification?: TaxInvoiceModificationInput
  /** 기재상 일련번호입니다. */
  taxInvoiceSerialNumber?: string
  /** 비고1입니다. */
  remarkOne?: string
  /** 비고2입니다. */
  remarkTwo?: string
  /** 비고3입니다. */
  remarkThree?: string
  /** 책번호 권 항목입니다. */
  bookVolumeNumber?: string
  /** 책번호 호 항목입니다. */
  bookIssueNumber?: string
  /** 사업자등록증 이미지 첨부 여부입니다. */
  includeBusinessLicenseImage?: boolean
  /** 통장사본 이미지 첨부 여부입니다. */
  includeBankBookImage?: boolean
  /** 상세 품목 목록입니다. */
  lineItems?: TaxInvoiceLineItemInput[]
  /** 추가 담당자 목록입니다. */
  additionalContacts?: TaxInvoiceAdditionalContactInput[]
}
