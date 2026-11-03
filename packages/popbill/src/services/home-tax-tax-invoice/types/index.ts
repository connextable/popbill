import type { WithPopbillCallOptions } from '@/client/call-options'
import type * as response from './response'
export type * from './response'

export const HomeTaxTaxInvoiceDirection = { Sales: 'SELL', Purchases: 'BUY', Trustee: 'TRUSTEE' } as const
export type HomeTaxTaxInvoiceDirection = (typeof HomeTaxTaxInvoiceDirection)[keyof typeof HomeTaxTaxInvoiceDirection] | (string & {})
export const HomeTaxTaxInvoiceSearchDateType = { Written: 'W', Issued: 'I', Sent: 'S' } as const
export type HomeTaxTaxInvoiceSearchDateType = (typeof HomeTaxTaxInvoiceSearchDateType)[keyof typeof HomeTaxTaxInvoiceSearchDateType] | (string & {})
export const HomeTaxTaxInvoiceJobStateCodes = { Waiting: 1, Processing: 2, Completed: 3 } as const
export interface HomeTaxTaxInvoiceBusinessInput {
  businessNumber: string
}
export interface RequestHomeTaxTaxInvoiceCollectionInput extends HomeTaxTaxInvoiceBusinessInput {
  /** yyyyMMdd 형식, 최대 3개월 단위로 요청합니다. */
  startDate: string
  endDate: string
  invoiceDirection: HomeTaxTaxInvoiceDirection
  searchDateType: HomeTaxTaxInvoiceSearchDateType
}
export interface HomeTaxTaxInvoiceJobInput extends HomeTaxTaxInvoiceBusinessInput {
  jobId: string
}
export interface HomeTaxTaxInvoiceFiltersInput extends HomeTaxTaxInvoiceJobInput {
  documentTypes?: ('N' | 'M' | (string & {}))[]
  taxTypes?: ('T' | 'N' | 'Z' | (string & {}))[]
  purposeTypes?: ('R' | 'C' | 'N' | (string & {}))[]
  taxRegistrationParty?: 'S' | 'B' | 'T' | (string & {})
  hasTaxRegistrationId?: boolean
  /** 여러 종사업장번호는 쉼표로 구분합니다. 선행 0을 보존합니다. */
  taxRegistrationIds?: string[]
  queryText?: string
}
export interface SearchHomeTaxTaxInvoicesInput extends HomeTaxTaxInvoiceFiltersInput {
  sortOrder?: 'D' | 'A' | (string & {})
  /** 기본값 1 */
  pageNumber?: number
  /** 기본값 500. 페이지당 상한은 팝빌 서버에서 검증합니다. */
  pageSize?: number
}
export interface HomeTaxTaxInvoiceDocumentInput extends HomeTaxTaxInvoiceBusinessInput {
  confirmationNumber: string
}
export interface RegisterHomeTaxTaxInvoiceDepartmentUserInput extends HomeTaxTaxInvoiceBusinessInput {
  departmentUserId: string
  departmentPassword: string
  /** 대표자 주민번호 앞 7자리. 홈택스 2차인증 해제 시 생략합니다. */
  identityNumber?: string | null
}
/** 명시적으로 수집을 요청하고 상태를 확인합니다. 자동 재요청이나 polling은 수행하지 않습니다. */
export interface HomeTaxTaxInvoiceService extends WithPopbillCallOptions<HomeTaxTaxInvoiceServiceOperations> {}

interface HomeTaxTaxInvoiceServiceOperations {
  /** 인증정보 등록 URL. Compat: `getCertificatePopUpURL` */
  getAuthenticationRegistrationUrl(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceAccessUrl>
  /** 인증서 만료일시. Compat: `getCertificateExpireDate` */
  getCertificateExpiration(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceCertificateExpiration>
  /** 인증서 검증. Compat: `checkCertValidation` */
  validateCertificate(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceOperationResult>
  /** 부서사용자 등록. Compat: `registDeptUser` */
  registerDepartmentUser(input: RegisterHomeTaxTaxInvoiceDepartmentUserInput): Promise<response.HomeTaxTaxInvoiceOperationResult>
  /** 부서사용자 등록 여부. Compat: `checkDeptUser` */
  checkDepartmentUserRegistration(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceOperationResult>
  /** 부서사용자 로그인 검증. Compat: `checkLoginDeptUser` */
  validateDepartmentUserLogin(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceOperationResult>
  /** 부서사용자 삭제. Compat: `deleteDeptUser` */
  deleteDepartmentUser(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceOperationResult>
  /** 수집 요청. Compat: `requestJob` */
  requestCollection(input: RequestHomeTaxTaxInvoiceCollectionInput): Promise<response.HomeTaxTaxInvoiceJobReceipt>
  /** 수집 상태 확인. Compat: `getJobState` */
  getCollectionState(input: HomeTaxTaxInvoiceJobInput): Promise<response.HomeTaxTaxInvoiceJobState>
  /** 활성 수집 목록. Compat: `listActiveJob` */
  listActiveCollections(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceJobState[]>
  /** 수집 내역 검색. Compat: `search` */
  searchTaxInvoices(input: SearchHomeTaxTaxInvoicesInput): Promise<response.HomeTaxTaxInvoiceSearchResult>
  /** 수집 내역 합계. Compat: `summary` */
  getTaxInvoiceTotals(input: HomeTaxTaxInvoiceFiltersInput): Promise<response.HomeTaxTaxInvoiceTotals>
  /** 수집 상세 조회. Compat: `getTaxinvoice` */
  getTaxInvoice(input: HomeTaxTaxInvoiceDocumentInput): Promise<response.HomeTaxTaxInvoiceDocument>
  /** 수집 XML 조회. Compat: `getXML` */
  getTaxInvoiceXml(input: HomeTaxTaxInvoiceDocumentInput): Promise<response.HomeTaxTaxInvoiceXmlResult>
  /** 팝업 URL. Compat: `getPopUpURL` */
  getTaxInvoicePopupUrl(input: HomeTaxTaxInvoiceDocumentInput): Promise<response.HomeTaxTaxInvoiceAccessUrl>
  /** 인쇄 URL. Compat: `getPrintURL` */
  getTaxInvoicePrintUrl(input: HomeTaxTaxInvoiceDocumentInput): Promise<response.HomeTaxTaxInvoiceAccessUrl>
  /** 정액제 신청 URL. Compat: `getFlatRatePopUpURL` */
  getFlatRateApplicationUrl(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceAccessUrl>
  /** 정액제 상태. Compat: `getFlatRateState` */
  getFlatRateState(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceFlatRateState>
  /** 과금정보. Compat: `getChargeInfo` */
  getChargeInfo(input: HomeTaxTaxInvoiceBusinessInput): Promise<response.HomeTaxTaxInvoiceChargeInfo>
}
