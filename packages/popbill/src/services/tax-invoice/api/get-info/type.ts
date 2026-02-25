import type { PopbillApiError } from '@/errors'
import type { PopbillRequestClient } from '@/internal/popbill'
import type { CloseDownState, IssueType, PurposeType, TaxInvoiceMgtKeyType, TaxType } from '@connextable/popbill-spec'

export interface TaxInvoiceGetInfoInput {
  businessNumber: string
  invoiceKeyType: TaxInvoiceMgtKeyType
  invoiceManagementKey: string
  userId?: string
}

export interface CreateGetTaxInvoiceInfoInput {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: PopbillApiError) => void
}

export interface TaxInvoiceInfo {
  /** 팝빌에서 할당한 문서 식별키 */
  itemKey: string
  /** 과세 유형 (예: 과세/영세/면세) */
  taxType: TaxType
  /** 작성일자 (yyyyMMdd) */
  writtenDate: string
  /** 임시저장 일시 (yyyyMMddHHmmss) */
  registeredAt: string
  /** 발행 형태 */
  issueType: IssueType
  /** 공급가액 합계 */
  totalSupplyCost: string
  /** 세액 합계 */
  totalTax: string
  /** 영수/청구 구분 */
  purposeType: PurposeType
  /** 발행 일시 (yyyyMMddHHmmss) */
  issuedAt: string
  /** 지연 발행 여부 */
  isLateIssued: boolean
  /** 개봉 여부 */
  isOpen: boolean
  /** 개봉 일시 (yyyyMMddHHmmss) */
  openedAt?: string
  /** 현재 상태 메모 */
  stateMemo: string
  /** 현재 상태 코드 */
  stateCode: number
  /** 상태 변경 일시 (yyyyMMddHHmmss) */
  stateChangedAt: string
  /** 국세청 승인번호 */
  nationalTaxServiceConfirmationNumber?: string
  /** 국세청 전송 결과 */
  nationalTaxServiceResult?: string
  /** 국세청 전송 일시 (yyyyMMddHHmmss) */
  nationalTaxServiceSentAt?: string
  /** 국세청 결과 수신 일시 (yyyyMMddHHmmss) */
  nationalTaxServiceResultReceivedAt?: string
  /** 국세청 전송 오류 코드 */
  nationalTaxServiceSendErrorCode?: string
  /** 수정세금계산서 사유 코드 */
  modificationCode?: number
  /** API 연동 문서 여부 */
  isApiLinkedDocument: boolean
  /** 공급자 상호 */
  supplierCompanyName: string
  /** 공급자 사업자번호 */
  supplierBusinessNumber: string
  /** 공급자 측 문서번호(파트너 할당) */
  supplierManagementKey?: string
  /** 공급자 인쇄 여부 */
  isSupplierPrinted: boolean
  /** 공급받는자 상호 */
  buyerCompanyName: string
  /** 공급받는자 사업자번호 */
  buyerBusinessNumber: string
  /** 공급받는자 측 문서번호(파트너 할당) */
  buyerManagementKey?: string
  /** 공급받는자 인쇄 여부 */
  isBuyerPrinted: boolean
  /** 공급받는자 휴폐업 상태 */
  buyerCloseDownState?: CloseDownState
  /** 공급받는자 휴폐업일자 (yyyyMMdd) */
  buyerCloseDownDate?: string
  /** 수탁자 상호 */
  trusteeCompanyName?: string
  /** 수탁자 사업자번호 */
  trusteeBusinessNumber?: string
  /** 수탁자 측 문서번호(파트너 할당) */
  trusteeManagementKey?: string
  /** 수탁자 인쇄 여부 */
  isTrusteePrinted?: boolean
}
