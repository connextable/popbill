/**
 * 수집 작업 상태(raw). SDK 문서는 jobState를 string으로, HTTP 문서와 예시는 number로 명세합니다.
 * 원본을 보존하며, 완료(3)와 성공(errorCode=1)을 함께 확인해야 합니다.
 * @see https://developers.popbill.com/api-reference/htcashbill/api/job
 */
export interface HomeTaxCashbillJobStateApiModel {
  jobID: string
  queryType?: string
  queryDateType?: string
  queryStDate?: string
  queryEnDate?: string
  jobState: number | string | null
  errorCode?: number | string | null
  errorReason?: string
  collectCount?: number
  regDT?: string
  jobStartDT?: string
  jobEndDT?: string
}

/** 금액 문자열과 마스킹된 식별번호를 그대로 보존합니다. */
export interface HomeTaxCashbillApiModel {
  ntsconfirmNum?: string
  invoiceType?: string
  tradeType?: string
  tradeUsage?: string
  franchiseCorpNum?: string
  franchiseCorpName?: string
  /** SDK 문서는 string, HTTP 문서와 예시는 number입니다. */
  franchiseCorpType?: number | string | null
  identityNum?: string
  identityNumType?: number | string | null
  customerName?: string
  cardOwnerName?: string
  deductionType?: number | string | null
  supplyCost?: string
  tax?: string
  serviceFee?: string
  totalAmount?: string
  tradeDate?: string
  tradeDT?: string
}

/** @see https://developers.popbill.com/api-reference/htcashbill/common-api/point */
export interface HomeTaxCashbillFlatRateStateApiModel {
  referenceID?: string
  state?: number
  closeRequestYN?: boolean
  useRestrictYN?: boolean
  closeOnExpired?: boolean
  unPaidYN?: boolean
  baseDate?: number
  contractDT?: string
  useEndDate?: string
}

export interface HomeTaxCashbillChargeInfoApiModel {
  unitCost?: string
  chargeMethod?: '연동' | '파트너' | (string & {})
  rateSystem?: '정액제' | '종량제' | (string & {})
}
/** @see https://developers.popbill.com/api-reference/htcashbill/webhook/webhook-event */
export interface HomeTaxCashbillWebhookBody extends HomeTaxCashbillApiModel {}
