import type * as Spec from '@connextable/popbill-spec'

type Success<T> = (response: T) => void
type Failure = (error: unknown) => void
type DefinedTail<TArgs extends unknown[]> = TArgs extends [...infer Prefix, infer Last] ? [...Prefix, Exclude<Last, undefined>] : TArgs
type Callback<TArgs extends unknown[], TResult> = {
  (...args: TArgs): void
  (...args: [...TArgs, success: Success<TResult> | undefined, error: Failure | undefined]): void
  (...args: [...DefinedTail<TArgs>, success: Success<TResult> | undefined, error?: Failure]): void
}
type CallbackWithUserId<TArgs extends unknown[], TResult> = Callback<TArgs, TResult> & {
  (...args: [...TArgs, userId: string | undefined]): void
  (...args: [...TArgs, userId: string, success: Success<TResult> | undefined, error?: Failure]): void
  (...args: [...TArgs, userId: string | undefined, success: Success<TResult> | undefined, error: Failure | undefined]): void
}
type JobArgs = [corpNum: string, jobId: string]
type FilterArgs = [...JobArgs, tradeType: Spec.HomeTaxCashbillTradeType[] | undefined, tradeUsage: Spec.HomeTaxCashbillTradeUsage[] | undefined]
type SearchArgs = [...FilterArgs, page: number | undefined, perPage: number | undefined, order: Spec.HomeTaxCashbillSortOrder | undefined]
type RegisterDepartmentUserArgs = [corpNum: string, departmentUserId: string, departmentUserPassword: string]
type RegisterDepartmentUserCallback = CallbackWithUserId<RegisterDepartmentUserArgs, Spec.HomeTaxCashbillApiResponseBase> &
  CallbackWithUserId<[...RegisterDepartmentUserArgs, identityNumber: string | null | undefined], Spec.HomeTaxCashbillApiResponseBase>

/** 레거시 홈택스 현금영수증 수집 callback 계약입니다. */
export interface HTCashbillCallbackService {
  getCertificatePopUpURL: CallbackWithUserId<[corpNum: string], string>
  getCertificateExpireDate: Callback<[corpNum: string], string>
  checkCertValidation: Callback<[corpNum: string], Spec.HomeTaxCashbillApiResponseBase>
  registDeptUser: RegisterDepartmentUserCallback
  checkDeptUser: CallbackWithUserId<[corpNum: string], Spec.HomeTaxCashbillApiResponseBase>
  checkLoginDeptUser: Callback<[corpNum: string], Spec.HomeTaxCashbillApiResponseBase>
  deleteDeptUser: CallbackWithUserId<[corpNum: string], Spec.HomeTaxCashbillApiResponseBase>
  requestJob: CallbackWithUserId<[corpNum: string, type: Spec.HomeTaxCashbillType, startDate: string, endDate: string], string>
  getJobState: CallbackWithUserId<JobArgs, Spec.HomeTaxCashbillJobStateApiModel>
  listActiveJob: CallbackWithUserId<[corpNum: string], Spec.HomeTaxCashbillJobStateApiModel[]>
  search: CallbackWithUserId<SearchArgs, Spec.HomeTaxCashbillSearchApiResponse>
  summary: CallbackWithUserId<FilterArgs, Spec.HomeTaxCashbillSummaryApiResponse>
  getFlatRatePopUpURL: CallbackWithUserId<[corpNum: string], string>
  getFlatRateState: CallbackWithUserId<[corpNum: string], Spec.HomeTaxCashbillFlatRateStateApiModel>
  getChargeInfo: CallbackWithUserId<[corpNum: string], Spec.HomeTaxCashbillChargeInfoApiModel>
}

/** 레거시 인자 순서를 유지한 Promise 계약입니다. */
export interface HTCashbillPromiseService {
  getCertificatePopUpURL(corpNum: string, userId?: string): Promise<string>
  getCertificateExpireDate(corpNum: string): Promise<string>
  checkCertValidation(corpNum: string): Promise<Spec.HomeTaxCashbillApiResponseBase>
  registDeptUser(...args: [...RegisterDepartmentUserArgs, userId?: string]): Promise<Spec.HomeTaxCashbillApiResponseBase>
  /** IdentityNum을 전달할 때는 UserID 자리까지 유지합니다. */
  registDeptUser(
    ...args: [...RegisterDepartmentUserArgs, identityNumber: string | null | undefined, userId: string | undefined]
  ): Promise<Spec.HomeTaxCashbillApiResponseBase>
  checkDeptUser(corpNum: string, userId?: string): Promise<Spec.HomeTaxCashbillApiResponseBase>
  checkLoginDeptUser(corpNum: string): Promise<Spec.HomeTaxCashbillApiResponseBase>
  deleteDeptUser(corpNum: string, userId?: string): Promise<Spec.HomeTaxCashbillApiResponseBase>
  requestJob(corpNum: string, type: Spec.HomeTaxCashbillType, startDate: string, endDate: string, userId?: string): Promise<string>
  getJobState(...args: [...JobArgs, userId?: string]): Promise<Spec.HomeTaxCashbillJobStateApiModel>
  listActiveJob(corpNum: string, userId?: string): Promise<Spec.HomeTaxCashbillJobStateApiModel[]>
  search(...args: [...SearchArgs, userId?: string]): Promise<Spec.HomeTaxCashbillSearchApiResponse>
  summary(...args: [...FilterArgs, userId?: string]): Promise<Spec.HomeTaxCashbillSummaryApiResponse>
  getFlatRatePopUpURL(corpNum: string, userId?: string): Promise<string>
  getFlatRateState(corpNum: string, userId?: string): Promise<Spec.HomeTaxCashbillFlatRateStateApiModel>
  getChargeInfo(corpNum: string, userId?: string): Promise<Spec.HomeTaxCashbillChargeInfoApiModel>
}
