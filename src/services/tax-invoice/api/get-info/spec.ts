import type { CloseDownState, IssueType, PurposeType, TaxType } from '../spec'

export interface TaxInvoiceInfoApiResponse {
  /** 팝빌에서 할당한 식별번호 (18자리) */
  itemKey: string
  /** 과세형태 (과세, 영세, 면세) */
  taxType: TaxType
  /** 작성일자 (형식: yyyyMMdd) */
  writeDate: string
  /** 임시저장 일시 (형식: yyyyMMddHHmmss) */
  regDT: string
  /** 발행형태 (정발행, 역발행, 위수탁) */
  issueType: IssueType
  /** 공급가액 합계 (정수만 입력 가능, 마이너스 금액 입력 가능, 소수점 아래 자동 절사) */
  supplyCostTotal: string
  /** 세액 합계 (정수만 입력 가능, 마이너스 금액 입력 가능, 소수점 아래 자동 절사) */
  taxTotal: string
  /** 영수/청구 (영수, 청구, 없음) */
  purposeType: PurposeType
  /** 발행일시 (형식: yyyyMMddHHmmss) */
  issueDT: string
  /** 지연발행 여부 (true: 지연발행, false: 정상발행) */
  lateIssueYN: boolean | string
  /** 개봉 여부 (true: 개봉, false: 미개봉) */
  openYN: boolean
  /** 개봉일시 (형식: yyyyMMddHHmmss) */
  openDT?: string
  /** 상태메모 (200자) */
  stateMemo: string
  /** 상태코드 (팝빌 상태코드 참조) */
  stateCode: number
  /** 상태 변경일시 (형식: yyyyMMddHHmmss) */
  stateDT: string
  /** 국세청승인번호 (전자세금계산서 발행 시점에 팝빌에서 자동으로 할당) */
  ntsconfirmNum?: string
  /** 국세청 전송결과 (6자리) */
  ntsresult?: string
  /** 국세청 전송일시 (형식: yyyyMMddHHmmss) */
  ntssendDT?: string
  /** 국세청 결과 수신일시 (형식: yyyyMMddHHmmss) */
  ntsresultDT?: string
  /** 국세청 결과코드 (6자리, 국세청 결과코드 참조) */
  ntssendErrCode?: string
  /** 수정세금계산서 발행시 입력한 사유코드 (1자리, 수정세금계산서 참조) */
  modifyCode?: number
  /** 연동문서 여부 (true: API를 통해 발행한 연동문서, false: 팝빌 사이트를 통해 발행한 문서) */
  interOPYN: boolean
  /** 공급자 상호 (200자) */
  invoicerCorpName: string
  /** 공급자 사업자번호 (10자리) */
  invoicerCorpNum: string
  /** 공급자 문서번호 (24자리, 공급자의 문서 관리를 위해 파트너가 할당한 식별번호) */
  invoicerMgtKey?: string
  /** 공급자 인쇄여부 (true: 인쇄, false: 미인쇄) */
  invoicerPrintYN: boolean
  /** 공급받는자 상호 (200자) */
  invoiceeCorpName: string
  /** 공급받는자 사업자번호 (10자리) */
  invoiceeCorpNum: string
  /** 공급받는자 문서번호 (24자리, 파트너가 할당한 문서번호) */
  invoiceeMgtKey?: string
  /** 공급받는자 인쇄여부 (true: 인쇄, false: 미인쇄) */
  invoiceePrintYN: boolean
  /** 공급받는자 휴폐업상태 (null: 미확인, 0: 미등록, 1: 사업중, 2: 폐업, 3: 휴업, 4: 확인실패) */
  closeDownState?: CloseDownState
  /** 공급받는자 휴폐업일자 (형식: yyyyMMdd) */
  closeDownStateDate?: string
  /** 수탁자 상호 (200자) */
  trusteeCorpName?: string
  /** 수탁자 사업자번호 (10자리) */
  trusteeCorpNum?: string
  /** 수탁자 문서번호 (24자리, 파트너가 할당한 문서번호) */
  trusteeMgtKey?: string
  /** 수탁자 인쇄여부 (true: 인쇄, false: 미인쇄) */
  trusteePrintYN?: boolean
  [key: string]: unknown
}
