import type * as Response from './response'
export type * from './response'

export const HomeTaxCashbillDirection = { Sales: 'SELL', Purchases: 'BUY' } as const
export type HomeTaxCashbillDirection = (typeof HomeTaxCashbillDirection)[keyof typeof HomeTaxCashbillDirection] | (string & {})
export const HomeTaxCashbillTradeType = { Approved: 'N', Cancelled: 'C' } as const
export type HomeTaxCashbillTradeType = (typeof HomeTaxCashbillTradeType)[keyof typeof HomeTaxCashbillTradeType] | (string & {})
export const HomeTaxCashbillTradeUsage = { IncomeDeduction: 'P', ExpenseProof: 'C' } as const
export type HomeTaxCashbillTradeUsage = (typeof HomeTaxCashbillTradeUsage)[keyof typeof HomeTaxCashbillTradeUsage] | (string & {})
export const HomeTaxCashbillSortOrder = { Ascending: 'A', Descending: 'D' } as const
export type HomeTaxCashbillSortOrder = (typeof HomeTaxCashbillSortOrder)[keyof typeof HomeTaxCashbillSortOrder] | (string & {})

export interface HomeTaxCashbillBusinessInput {
  businessNumber: string
}
export interface RequestHomeTaxCashbillCollectionInput extends HomeTaxCashbillBusinessInput {
  /** yyyyMMdd, 한 번에 최대 3개월. JobID는 요청 시점부터 1시간 유효합니다. */
  startDate: string
  endDate: string
  receiptDirection: HomeTaxCashbillDirection
}
export interface HomeTaxCashbillJobInput extends HomeTaxCashbillBusinessInput {
  jobId: string
}
export interface HomeTaxCashbillFilterInput extends HomeTaxCashbillJobInput {
  tradeTypes?: HomeTaxCashbillTradeType[]
  tradeUsages?: HomeTaxCashbillTradeUsage[]
}
export interface SearchHomeTaxCashbillsInput extends HomeTaxCashbillFilterInput {
  /** @default D */
  sortOrder?: HomeTaxCashbillSortOrder
  /** @default 1 */
  pageNumber?: number
  /** @default 500 */
  pageSize?: number
}
export interface RegisterHomeTaxCashbillDepartmentUserInput extends HomeTaxCashbillBusinessInput {
  departmentUserId: string
  departmentUserPassword: string
  /** 홈택스 2차인증 설정 시 대표자 주민번호 앞 7자리, 해제된 경우 생략합니다. */
  representativeIdentityPrefix?: string | null
}

/** 홈택스 현금영수증 수집 modern API. 자동 폴링 없이 작업아이디를 반환합니다. */
export interface HomeTaxCashbillService {
  /** Compat: `getCertificatePopUpURL` */
  getAuthenticationRegistrationUrl(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillAccessUrl>
  /** Compat: `getCertificateExpireDate` */
  getCertificateExpiration(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillCertificateExpiration>
  /** Compat: `checkCertValidation` */
  validateCertificate(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillOperationResult>
  /** Compat: `registDeptUser` */
  registerDepartmentUser(input: RegisterHomeTaxCashbillDepartmentUserInput): Promise<Response.HomeTaxCashbillOperationResult>
  /** Compat: `checkDeptUser` */
  checkDepartmentUserRegistration(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillOperationResult>
  /** Compat: `checkLoginDeptUser` */
  validateDepartmentUser(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillOperationResult>
  /** Compat: `deleteDeptUser` */
  deleteDepartmentUser(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillOperationResult>
  /** Compat: `requestJob` */
  requestCollection(input: RequestHomeTaxCashbillCollectionInput): Promise<Response.HomeTaxCashbillCollectionJob>
  /** Compat: `getJobState` */
  getCollectionJobState(input: HomeTaxCashbillJobInput): Promise<Response.HomeTaxCashbillCollectionJobState>
  /** Compat: `listActiveJob` */
  listActiveCollectionJobs(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillCollectionJobState[]>
  /** Compat: `search` */
  searchCashbills(input: SearchHomeTaxCashbillsInput): Promise<Response.HomeTaxCashbillSearchResult>
  /** Compat: `summary` */
  getCashbillSummary(input: HomeTaxCashbillFilterInput): Promise<Response.HomeTaxCashbillSummary>
  /** Compat: `getFlatRatePopUpURL` */
  getFlatRateRegistrationUrl(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillAccessUrl>
  /** Compat: `getFlatRateState` */
  getFlatRateState(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillFlatRateState>
  /** Compat: `getChargeInfo` */
  getChargeInfo(input: HomeTaxCashbillBusinessInput): Promise<Response.HomeTaxCashbillChargeInfo>
}
