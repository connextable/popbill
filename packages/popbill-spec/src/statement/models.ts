import type {
  StatementDateString,
  StatementDateTimeString,
  StatementEmailType,
  StatementItemCode,
  StatementPurposeType,
  StatementTaxType,
} from './common'

/**
 * 전자명세서 상세항목(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/issue
 */
export interface StatementDetailApiModel {
  /** 1부터 시작하는 항목 번호. */
  serialNum: number
  purchaseDT?: StatementDateString
  itemName?: string
  spec?: string
  qty?: string
  unitCost?: string
  supplyCost?: string
  tax?: string
  remark?: string
  spare1?: string
  spare2?: string
  spare3?: string
  spare4?: string
  spare5?: string
  spare6?: string
  spare7?: string
  spare8?: string
  spare9?: string
  spare10?: string
  spare11?: string
  spare12?: string
  spare13?: string
  spare14?: string
  spare15?: string
  spare16?: string
  spare17?: string
  spare18?: string
  spare19?: string
  spare20?: string
}

/**
 * 6종 전자명세서 공통 본문(raw).
 * 임시저장·수정과 상세조회에서 함께 사용한다. 작업별 필수 입력은 서버에서 확인한다.
 * 금액·수량은 원본 문자열을 유지하며, 맞춤양식의 추가속성도 그대로 전달한다.
 * @see https://developers.popbill.com/api-reference/statement/api/issue
 */
export interface StatementApiModel {
  itemCode?: StatementItemCode
  mgtKey?: string
  /** 상세조회에서 반환되는 팝빌 승인번호. */
  invoiceNum?: string
  formCode?: string
  writeDate?: StatementDateString
  /** 거래명세서(121)를 발행할 때 필요하다. */
  taxType?: StatementTaxType
  purposeType?: StatementPurposeType
  serialNum?: string
  taxTotal?: string
  supplyCostTotal?: string
  totalAmount?: string
  remark1?: string
  remark2?: string
  remark3?: string
  senderCorpNum?: string
  senderTaxRegID?: string
  senderCorpName?: string
  senderCEOName?: string
  senderAddr?: string
  senderBizType?: string
  senderBizClass?: string
  senderContactName?: string
  senderDeptName?: string
  senderTEL?: string
  senderHP?: string
  senderEmail?: string
  senderFAX?: string
  receiverCorpNum?: string
  receiverTaxRegID?: string
  receiverCorpName?: string
  receiverCEOName?: string
  receiverAddr?: string
  receiverBizType?: string
  receiverBizClass?: string
  receiverContactName?: string
  receiverDeptName?: string
  receiverTEL?: string
  receiverHP?: string
  receiverEmail?: string
  receiverFAX?: string
  businessLicenseYN?: boolean
  bankBookYN?: boolean
  smssendYN?: boolean
  /** 상세조회 응답의 자동승인 설정. */
  autoAcceptYN?: boolean
  /** 상세조회 응답의 팩스 전송 설정. */
  faxsendYN?: boolean
  propertyBag?: Record<string, string>
  detailList?: StatementDetailApiModel[]
}

/**
 * 단건·대량 상태 조회와 검색의 전자명세서 요약(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/info
 */
export interface StatementInfoApiModel {
  itemCode?: StatementItemCode
  itemKey?: string
  invoiceNum?: string
  mgtKey?: string
  taxType?: StatementTaxType
  writeDate?: StatementDateString
  regDT?: StatementDateTimeString
  senderCorpName?: string
  senderCorpNum?: string
  senderPrintYN?: boolean
  receiverCorpName?: string
  receiverCorpNum?: string
  receiverPrintYN?: boolean
  supplyCostTotal?: string
  taxTotal?: string
  purposeType?: StatementPurposeType
  issueDT?: StatementDateTimeString
  stateCode?: number
  stateDT?: StatementDateTimeString
  stateMemo?: string
  openYN?: boolean
  openDT?: StatementDateTimeString
}

export type StatementInfo = StatementInfoApiModel

/** 상태 변경 이력(raw). */
export interface StatementLogApiModel {
  docLogType?: number
  log?: string
  procType?: '연동' | '일반' | '시스템'
  procCorpName?: string
  procContactName?: string
  procMemo?: string
  regDT?: StatementDateTimeString
  ip?: string
}

export type StatementLog = StatementLogApiModel

/** 첨부파일 메타데이터(raw). */
export interface StatementFileApiModel {
  serialNum?: number
  attachedFile?: string
  fileSize?: number
  displayName?: string
  regDT?: StatementDateTimeString
}

export type StatementFile = StatementFileApiModel

/** 문서 종류별 과금 정보(raw). */
export interface StatementChargeInfoApiResponse {
  unitCost?: string
  chargeMethod?: '연동' | '파트너'
  rateSystem?: '종량제'
}

export type StatementChargeInfo = StatementChargeInfoApiResponse

/** 알림메일 발송 설정(raw). */
export interface StatementEmailConfigApiModel {
  emailType?: StatementEmailType
  sendYN?: boolean
}

export type StatementEmailConfig = StatementEmailConfigApiModel
