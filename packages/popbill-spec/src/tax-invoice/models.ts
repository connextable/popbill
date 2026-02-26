import type {
  CloseDownState,
  InvoiceeType,
  IssueType,
  PurposeType,
  TaxInvoiceApiResponseBase,
  TaxInvoiceDateString,
  TaxInvoiceEmailType,
  TaxInvoiceMgtKeyType,
  TaxType,
} from './common'
import type { TaxInvoiceNtsResultCode, TaxInvoiceStateCode } from './response-codes'

/**
 * Tax Invoice Domain Raw Models
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert
 */

/**
 * 세금계산서 상세항목(raw).
 */
export interface TaxInvoiceDetailApiModel {
  /**
   * 일련번호.
   *
   * detailList 항목에서 필수 입력값.
   */
  serialNum: number

  /**
   * 거래일자
   */
  purchaseDT?: TaxInvoiceDateString

  /**
   * 품목명
   */
  itemName?: string

  /**
   * 규격
   */
  spec?: string

  /**
   * 수량
   */
  qty?: string

  /**
   * 단가
   */
  unitCost?: string

  /**
   * 공급가액
   */
  supplyCost?: string

  /**
   * 세액
   */
  tax?: string

  /**
   * 비고
   */
  remark?: string
}

/**
 * 세금계산서 추가 담당자(raw).
 */
export interface TaxInvoiceAdditionalContactApiModel {
  /**
   * 일련번호.
   *
   * addContactList 항목에서 필수 입력값.
   */
  serialNum: number

  /**
   * 담당자명
   */
  contactName?: string

  /**
   * 이메일주소.
   *
   * addContactList 항목에서 필수 입력값.
   */
  email: string
}

/**
 * 세금계산서 문서 본문(raw).
 */
export interface TaxInvoiceApiModel {
  /**
   * 거래명세서 동시작성 여부
   */
  writeSpecification?: boolean

  /**
   * 작성일자
   */
  writeDate?: TaxInvoiceDateString

  /**
   * 정과금/역과금
   */
  chargeDirection?: string

  /**
   * 발행형태 [정발행,역발행,위수탁]
   */
  issueType?: IssueType

  /**
   * 영수/청구
   */
  purposeType?: PurposeType

  /**
   * 발행시기
   */
  issueTiming?: string

  /**
   * 과세형태 [과세,영세,면세]
   */
  taxType?: TaxType

  /**
   * 공급자 사업자번호
   */
  invoicerCorpNum?: string

  /**
   * [공급자] 문서번호
   */
  invoicerMgtKey?: string

  /**
   * 공급자 종사업장 식별번호, 필요시 기재. 형식은 숫자 4자리.
   */
  invoicerTaxRegID?: string

  /**
   * 공급자 상호
   */
  invoicerCorpName?: string

  /**
   * 공급자 대표자 성명
   */
  invoicerCEOName?: string

  /**
   * 공급자 주소
   */
  invoicerAddr?: string

  /**
   * 공급자 업태
   */
  invoicerBizClass?: string

  /**
   * 공급자 종목
   */
  invoicerBizType?: string

  /**
   * 공급자 담당자명
   */
  invoicerContactName?: string

  /**
   * 공급자 담당자 연락처
   */
  invoicerTEL?: string

  /**
   * 공급자 담당자 휴대폰번호
   */
  invoicerHP?: string

  /**
   * 공급자 담당자 이메일
   */
  invoicerEmail?: string

  /**
   * 공급자 담당자 휴대폰번호 문자발송 여부
   */
  invoicerSMSSendYN?: boolean | string

  /**
   * 공급자 인쇄여부
   */
  invoicerPrintYN?: boolean | string

  /**
   * 공급자 주민번호
   */
  invoicerRDN?: string

  /**
   * 공급자 외국인번호
   */
  invoicerOLN?: string

  /**
   * 공급자 종사업자번호
   */
  invoicerTaxNum?: string

  /**
   * 공급자 종사업자 일련번호
   */
  invoicerPSerialNum?: string

  /**
   * 공급자 법인구분 [개인, 법인]
   */
  invoicerCorpCls?: string

  /**
   * 공급자 부서명
   */
  invoicerDeptName?: string

  /**
   * 공급받는자 구분 [사업자,개인,외국인]
   */
  invoiceeType?: InvoiceeType

  /**
   * 공급받는자 사업자번호 [개인:주민등록번호 / 외국인:외국인등록번호]
   */
  invoiceeCorpNum?: string

  /**
   * [공급받는자] 문서번호
   */
  invoiceeMgtKey?: string

  /**
   * 공급받는자 종사업장 식별번호, 필요시 기재. 형식은 숫자 4자리.
   */
  invoiceeTaxRegID?: string

  /**
   * 공급받는자 상호
   */
  invoiceeCorpName?: string

  /**
   * 공급받는자 대표자 성명
   */
  invoiceeCEOName?: string

  /**
   * 공급받는자 주소
   */
  invoiceeAddr?: string

  /**
   * 공급받는자 업태
   */
  invoiceeBizClass?: string

  /**
   * 공급받는자 종목
   */
  invoiceeBizType?: string

  /**
   * 공급받는자 담당자명
   */
  invoiceeContactName1?: string

  /**
   * 공급받는자 담당자 연락처
   */
  invoiceeTEL1?: string

  /**
   * 공급받는자 담당자 휴대폰번호
   */
  invoiceeHP1?: string

  /**
   * 공급받는자 담당자 이메일
   */
  invoiceeEmail1?: string

  /**
   * 공급받는자 예비 담당자명
   */
  invoiceeContactName2?: string

  /**
   * 공급받는자 예비 담당자 연락처
   */
  invoiceeTEL2?: string

  /**
   * 공급받는자 예비 담당자 휴대폰번호
   */
  invoiceeHP2?: string

  /**
   * 공급받는자 예비 담당자 이메일
   */
  invoiceeEmail2?: string

  /**
   * 공급받는자 담당자 휴대폰번호 문자발송 여부
   */
  invoiceeSMSSendYN?: boolean | string

  /**
   * 공급받는자 인쇄여부
   */
  invoiceePrintYN?: boolean | string

  /**
   * 공급받는자 주민번호
   */
  invoiceeRDN?: string

  /**
   * 공급받는자 외국인번호
   */
  invoiceeOLN?: string

  /**
   * 공급받는자 종사업자번호
   */
  invoiceeTaxNum?: string

  /**
   * 공급받는자 종사업자 일련번호
   */
  invoiceePSerialNum?: string

  /**
   * 공급받는자 법인구분 [개인, 법인]
   */
  invoiceeCorpCls?: string

  /**
   * 공급받는자 부서명
   */
  invoiceeDeptName1?: string

  /**
   * 공급받는자 예비부서명
   */
  invoiceeDeptName2?: string

  /**
   * 공급받는자 휴폐업 상태 [null,0,1,2,3,4]
   */
  closeDownState?: CloseDownState

  /**
   * 공급받는자 휴폐업일자
   */
  closeDownStateDate?: TaxInvoiceDateString

  /**
   * 수탁자 사업자번호
   */
  trusteeCorpNum?: string

  /**
   * [수탁자] 문서번호
   */
  trusteeMgtKey?: string

  /**
   * 수탁자 종사업장 식별번호, 필요시 기재. 형식은 숫자 4자리.
   */
  trusteeTaxRegID?: string

  /**
   * 수탁자 상호
   */
  trusteeCorpName?: string

  /**
   * 수탁자 대표자 성명
   */
  trusteeCEOName?: string

  /**
   * 수탁자 주소
   */
  trusteeAddr?: string

  /**
   * 수탁자 업태
   */
  trusteeBizClass?: string

  /**
   * 수탁자 종목
   */
  trusteeBizType?: string

  /**
   * 수탁자 담당자명
   */
  trusteeContactName?: string

  /**
   * 수탁자 담당자 연락처
   */
  trusteeTEL?: string

  /**
   * 수탁자 담당자 휴대폰번호
   */
  trusteeHP?: string

  /**
   * 수탁자 담당자 이메일
   */
  trusteeEmail?: string

  /**
   * 수탁자 담당자 휴대폰번호 문자발송 여부
   */
  trusteeSMSSendYN?: boolean | string

  /**
   * 수탁자 인쇄여부
   */
  trusteePrintYN?: boolean | string

  /**
   * 수탁자 주민번호
   */
  trusteeRDN?: string

  /**
   * 수탁자 외국인번호
   */
  trusteeOLN?: string

  /**
   * 수탁자 종사업자번호
   */
  trusteeTaxNum?: string

  /**
   * 수탁자 종사업자 일련번호
   */
  trusteePSerialNum?: string

  /**
   * 수탁자 법인구분 [개인, 법인]
   */
  trusteeCorpCls?: string

  /**
   * 수탁자 부서명
   */
  trusteeDeptName?: string

  /**
   * 세액합계
   */
  taxTotal?: string

  /**
   * 공급가액 합계
   */
  supplyCostTotal?: string

  /**
   * 합계금액 합계
   */
  totalAmount?: string

  /**
   * 수정사유코드
   */
  modifyCode?: number

  /**
   * 수정세금계산서 작성시 원본세금계산서의 국세청승인번호
   */
  orgNTSConfirmNum?: string

  /**
   * 기재상 일련번호
   */
  serialNum?: string

  /**
   * 현금
   */
  cash?: string

  /**
   * 수표
   */
  chkBill?: string

  /**
   * 어음
   */
  note?: string

  /**
   * 외상
   */
  credit?: string

  /**
   * 비고1
   */
  remark1?: string

  /**
   * 비고2
   */
  remark2?: string

  /**
   * 비고3
   */
  remark3?: string

  /**
   * 책번호 '권' 항목
   */
  kwon?: string

  /**
   * 책번호 '호' 항목
   */
  ho?: string

  /**
   * 사업자등록증 이미지 첨부여부
   */
  businessLicenseYN?: boolean | string

  /**
   * 통장사본 이미지 첨부여부
   */
  bankBookYN?: boolean | string

  /**
   * 발행일시
   */
  issueDT?: string

  /**
   * 상태코드
   */
  stateCode?: TaxInvoiceStateCode | number | string

  /**
   * 상태코드 갱신일시
   */
  stateDT?: string

  /**
   * 지연발행 여부
   */
  lateIssueYN?: boolean | string

  /**
   * 개봉 여부
   */
  openYN?: boolean | string

  /**
   * 개봉일시
   */
  openDT?: string

  /**
   * 국세청승인번호
   */
  ntsconfirmNum?: string

  /**
   * 국세청 전송결과
   */
  ntsresult?: string

  /**
   * 국세청 전송일시
   */
  ntssendDT?: string

  /**
   * 국세청 결과 수신일시
   */
  ntsresultDT?: string

  /**
   * 국세청 전송결과코드
   */
  ntssendErrCode?: TaxInvoiceNtsResultCode | string

  /**
   * 정발행 역발행 여부
   */
  interOPYN?: boolean | string

  /**
   * 상세항목
   */
  detailList?: TaxInvoiceDetailApiModel[]

  /**
   * 추가담당자
   */
  addContactList?: TaxInvoiceAdditionalContactApiModel[]

  [key: string]: unknown
}

/**
 * 세금계산서 요약정보(raw).
 */
export interface TaxInvoiceInfoApiModel {
  /**
   * 문서 아이템키
   */
  itemKey: string

  /**
   * 과세형태 [과세,영세,면세]
   */
  taxType: TaxType

  /**
   * 작성일자
   */
  writeDate: TaxInvoiceDateString

  /**
   * 등록일시
   */
  regDT: string

  /**
   * 발행형태 [정발행,역발행,위수탁]
   */
  issueType: IssueType

  /**
   * 공급가액 합계
   */
  supplyCostTotal: string

  /**
   * 세액 합계
   */
  taxTotal: string

  /**
   * 영수/청구
   */
  purposeType: PurposeType

  /**
   * 발행일시
   */
  issueDT: string

  /**
   * 지연발행여부
   */
  lateIssueYN: boolean | string

  /**
   * 개봉 여부
   */
  openYN: boolean | string

  /**
   * 개봉일시
   */
  openDT?: string

  /**
   * 상태메모
   */
  stateMemo: string

  /**
   * 상태코드
   */
  stateCode: TaxInvoiceStateCode

  /**
   * 상태코드 갱신일시
   */
  stateDT: string

  /**
   * 국세청승인번호
   */
  ntsconfirmNum?: string

  /**
   * 국세청 전송결과
   */
  ntsresult?: string

  /**
   * 국세청 전송일시
   */
  ntssendDT?: string

  /**
   * 국세청 결과 수신일시
   */
  ntsresultDT?: string

  /**
   * 국세청 전송결과코드
   */
  ntssendErrCode?: TaxInvoiceNtsResultCode

  /**
   * 수정사유코드
   */
  modifyCode?: number

  /**
   * 정발행 역발행 여부
   */
  interOPYN: boolean | string

  /**
   * 공급자 상호
   */
  invoicerCorpName: string

  /**
   * 공급자 사업자번호
   */
  invoicerCorpNum: string

  /**
   * 공급자 문서번호
   */
  invoicerMgtKey?: string

  /**
   * 공급자 인쇄여부
   */
  invoicerPrintYN: boolean | string

  /**
   * 공급받는자 상호
   */
  invoiceeCorpName: string

  /**
   * 공급받는자 사업자번호
   */
  invoiceeCorpNum: string

  /**
   * 공급받는자 문서번호
   */
  invoiceeMgtKey?: string

  /**
   * 공급받는자 인쇄여부
   */
  invoiceePrintYN: boolean | string

  /**
   * 휴폐업 상태 [미등록, 휴업, 폐업]
   */
  closeDownState?: CloseDownState

  /**
   * 휴폐업일자
   */
  closeDownStateDate?: TaxInvoiceDateString

  /**
   * 수탁자 상호
   */
  trusteeCorpName?: string

  /**
   * 수탁자 사업자번호
   */
  trusteeCorpNum?: string

  /**
   * 수탁자 문서번호
   */
  trusteeMgtKey?: string

  /**
   * 수탁자 인쇄여부
   */
  trusteePrintYN?: boolean | string
  [key: string]: unknown
}

/**
 * 전자서명 이력(raw).
 */
export interface TaxInvoiceLogApiModel {
  /**
   * 문서이력 유형
   */
  docLogType?: number | string

  /**
   * 로그
   */
  log?: string

  /**
   * 처리형태
   */
  procType?: string

  /**
   * 처리회사명
   */
  procCorpName?: string

  /**
   * 처리담당자
   */
  procContactName?: string

  /**
   * 처리형태명
   */
  procMemo?: string

  /**
   * 등록일시
   */
  regDT?: string

  /**
   * IP주소
   */
  ip?: string
  [key: string]: unknown
}

/**
 * 첨부파일 메타(raw).
 */
export interface TaxInvoiceFileMetaApiModel {
  /**
   * 파일아이디
   */
  serialNum?: number

  /**
   * 첨부파일명
   */
  attachedFile?: string

  /**
   * 표시명
   */
  displayName?: string

  /**
   * 등록일시
   */
  regDT?: string
  [key: string]: unknown
}

/**
 * Search 결과 list 항목(raw).
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#Search
 *
 * Search 응답 list는 `GetInfo` 응답 구성과 동일하다.
 */
export type TaxInvoiceSearchResultItemApiModel = TaxInvoiceInfoApiModel

/**
 * 세금계산서 Search 응답(raw).
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#Search
 */
export interface TaxInvoiceSearchResultApiModel extends TaxInvoiceApiResponseBase {
  /**
   * 검색결과 전체 건수
   */
  total?: number | string

  /**
   * 페이지당 목록개수
   */
  perPage?: number | string

  /**
   * 페이지 번호
   */
  pageNum?: number | string

  /**
   * 페이지수
   */
  pageCount?: number | string

  /**
   * 검색결과 목록
   */
  list?: TaxInvoiceSearchResultItemApiModel[]
}

/**
 * 즉시발행 결과(raw).
 */
export interface TaxInvoiceIssueResponseApiModel extends TaxInvoiceApiResponseBase {
  /**
   * 국세청승인번호
   */
  ntsConfirmNum?: string

  /**
   * 발행일시
   */
  issueDT?: string
}

/**
 * 대량접수 결과(raw).
 */
export interface TaxInvoiceBulkSubmitResponseApiModel extends TaxInvoiceApiResponseBase {
  /**
   * 접수아이디
   */
  receiptID?: string
}

/**
 * 대량접수 상세 결과(raw).
 */
export interface TaxInvoiceBulkResultItemApiModel {
  /**
   * 문서번호 유형
   */
  keyType?: TaxInvoiceMgtKeyType

  /**
   * [공급자] 문서번호
   */
  invoicerMgtKey?: string

  /**
   * [수탁자] 문서번호
   */
  trusteeMgtKey?: string

  /**
   * 처리결과 코드
   */
  code?: number | string

  /**
   * 처리결과 메시지
   */
  message?: string

  /**
   * 국세청승인번호
   */
  ntsconfirmNum?: string

  /**
   * 접수일시
   */
  receiptDT?: string

  /**
   * 발행일시
   */
  issueDT?: string
  [key: string]: unknown
}

/**
 * 대량접수 조회(raw).
 */
export interface TaxInvoiceBulkResultApiModel extends TaxInvoiceApiResponseBase {
  /**
   * 접수아이디
   */
  receiptID?: string

  /**
   * 제출아이디
   */
  submitID?: string

  /**
   * 제출건수
   */
  submitCount?: number | string

  /**
   * 성공건수
   */
  successCount?: number | string

  /**
   * 실패건수
   */
  failCount?: number | string

  /**
   * 처리상태 [0:미처리, 1:처리중, 2:완료]
   */
  txState?: number | string

  /**
   * 처리시작일시
   */
  txStartDT?: string

  /**
   * 처리완료일시
   */
  txEndDT?: string

  /**
   * 처리결과코드
   */
  txResultCode?: number | string

  /**
   * 세금계산서 발행처리 결과
   */
  issueResult?: TaxInvoiceBulkResultItemApiModel[]
}

/**
 * 국세청 인증서 정보(raw).
 */
export interface TaxInvoiceTaxCertInfoApiModel {
  /**
   * 등록일시
   *
   * `yyyyMMddHHmmss` 형식.
   */
  regDT?: string

  /**
   * 만료일시
   *
   * `yyyyMMddHHmmss` 형식.
   */
  expireDT?: string

  /**
   * 발급자 Distinguished Name
   */
  issuerDN?: string

  /**
   * 인증서 Distinguished Name
   */
  subjectDN?: string

  /**
   * 인증서 종류
   */
  issuerName?: string

  /**
   * 인증서 정책 OID
   */
  OID?: string

  /**
   * 등록 담당자 성명
   */
  regContactName?: string

  /**
   * 등록 담당자 아이디
   */
  regContactID?: string

  [key: string]: unknown
}

/**
 * 이메일 발송설정(raw).
 */
export interface TaxInvoiceEmailConfigApiModel {
  /**
   * 메일전송 설정 구분코드
   */
  emailType?: TaxInvoiceEmailType

  /**
   * 전송여부
   */
  sendYN?: boolean | string

  [key: string]: unknown
}
