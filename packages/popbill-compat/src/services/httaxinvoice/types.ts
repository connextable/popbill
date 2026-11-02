import type * as Spec from '@connextable/popbill-spec'

type Success<T> = (response: T) => void
type Failure = (error: unknown) => void
interface Callback<TArgs extends unknown[], TResult> {
  (...args: TArgs): void
  (...args: [...TArgs, success: Success<TResult> | undefined, error?: Failure]): void
}
interface FullCallback<TArgs extends unknown[], TResult> {
  (...args: TArgs): void
  (...args: [...TArgs, success: Success<TResult> | undefined, error: Failure | undefined]): void
}
/** A single function after an undefined slot is the legacy error-only form. */
type UnambiguousCallback<TArgs extends unknown[], TResult> = FullCallback<TArgs, TResult> &
  (TArgs extends [...infer Prefix, infer Last] ? Callback<[...Prefix, Exclude<Last, undefined>], TResult> : Callback<TArgs, TResult>)
type CallbackWithUserId<TArgs extends unknown[], TResult> = UnambiguousCallback<TArgs, TResult> &
  Callback<[...TArgs, userId: string], TResult> &
  FullCallback<[...TArgs, userId: string | undefined], TResult>
type Filters = [
  corpNum: string,
  jobId: string,
  type: string[] | undefined,
  taxType: string[] | undefined,
  purposeType: string[] | undefined,
  taxRegIdType: string | undefined,
  taxRegIdYn: string | undefined,
  taxRegId: string | undefined,
]
type SearchArgs = [...Filters, page: number | undefined, perPage: number | undefined, order: string | undefined]
type SearchCallback = CallbackWithUserId<SearchArgs, Spec.HomeTaxTaxInvoiceSearchApiResponse> &
  FullCallback<[...SearchArgs, userId: string | undefined, searchString: string | undefined], Spec.HomeTaxTaxInvoiceSearchApiResponse>
type SummaryCallback = CallbackWithUserId<Filters, Spec.HomeTaxTaxInvoiceSummaryApiResponse> &
  FullCallback<[...Filters, userId: string | undefined, searchString: string | undefined], Spec.HomeTaxTaxInvoiceSummaryApiResponse>
type DepartmentArgs = [corpNum: string, departmentUserId: string, departmentPassword: string]
type RegisterDepartmentCallback = CallbackWithUserId<DepartmentArgs, Spec.HomeTaxTaxInvoiceApiResponseBase> &
  FullCallback<[...DepartmentArgs, identityNumber: string | null | undefined, userId: string | undefined], Spec.HomeTaxTaxInvoiceApiResponseBase>

export interface HTTaxinvoiceCallbackService {
  getCertificatePopUpURL: CallbackWithUserId<[corpNum: string], string>
  getCertificateExpireDate: Callback<[corpNum: string], string>
  checkCertValidation: Callback<[corpNum: string], Spec.HomeTaxTaxInvoiceApiResponseBase>
  registDeptUser: RegisterDepartmentCallback
  checkDeptUser: CallbackWithUserId<[corpNum: string], Spec.HomeTaxTaxInvoiceApiResponseBase>
  checkLoginDeptUser: Callback<[corpNum: string], Spec.HomeTaxTaxInvoiceApiResponseBase>
  deleteDeptUser: CallbackWithUserId<[corpNum: string], Spec.HomeTaxTaxInvoiceApiResponseBase>
  requestJob: CallbackWithUserId<
    [corpNum: string, queryType: Spec.HomeTaxTaxInvoiceQueryType, dateType: Spec.HomeTaxTaxInvoiceDateType, startDate: string, endDate: string],
    string
  >
  getJobState: CallbackWithUserId<[corpNum: string, jobId: string], Spec.HomeTaxTaxInvoiceJobStateApiModel>
  listActiveJob: CallbackWithUserId<[corpNum: string], Spec.HomeTaxTaxInvoiceJobStateApiModel[]>
  search: SearchCallback
  summary: SummaryCallback
  getTaxinvoice: CallbackWithUserId<[corpNum: string, ntsConfirmNum: string], Spec.HomeTaxTaxInvoiceApiModel>
  getXML: CallbackWithUserId<[corpNum: string, ntsConfirmNum: string], Spec.HomeTaxTaxInvoiceXmlApiResponse>
  getPopUpURL: CallbackWithUserId<[corpNum: string, ntsConfirmNum: string], string>
  getPrintURL: CallbackWithUserId<[corpNum: string, ntsConfirmNum: string], string>
  getFlatRatePopUpURL: CallbackWithUserId<[corpNum: string], string>
  getFlatRateState: CallbackWithUserId<[corpNum: string], Spec.HomeTaxTaxInvoiceFlatRateStateApiModel>
  getChargeInfo: CallbackWithUserId<[corpNum: string], Spec.HomeTaxTaxInvoiceChargeInfoApiResponse>
}
export interface HTTaxinvoicePromiseService {
  getCertificatePopUpURL(corpNum: string, userId?: string): Promise<string>
  getCertificateExpireDate(corpNum: string): Promise<string>
  checkCertValidation(corpNum: string): Promise<Spec.HomeTaxTaxInvoiceApiResponseBase>
  registDeptUser(...args: [...DepartmentArgs, userId?: string]): Promise<Spec.HomeTaxTaxInvoiceApiResponseBase>
  registDeptUser(
    ...args: [...DepartmentArgs, identityNumber: string | null | undefined, userId: string | undefined]
  ): Promise<Spec.HomeTaxTaxInvoiceApiResponseBase>
  checkDeptUser(corpNum: string, userId?: string): Promise<Spec.HomeTaxTaxInvoiceApiResponseBase>
  checkLoginDeptUser(corpNum: string): Promise<Spec.HomeTaxTaxInvoiceApiResponseBase>
  deleteDeptUser(corpNum: string, userId?: string): Promise<Spec.HomeTaxTaxInvoiceApiResponseBase>
  requestJob(
    corpNum: string,
    queryType: Spec.HomeTaxTaxInvoiceQueryType,
    dateType: Spec.HomeTaxTaxInvoiceDateType,
    startDate: string,
    endDate: string,
    userId?: string
  ): Promise<string>
  getJobState(corpNum: string, jobId: string, userId?: string): Promise<Spec.HomeTaxTaxInvoiceJobStateApiModel>
  listActiveJob(corpNum: string, userId?: string): Promise<Spec.HomeTaxTaxInvoiceJobStateApiModel[]>
  search(...args: [...SearchArgs, userId?: string, searchString?: string]): Promise<Spec.HomeTaxTaxInvoiceSearchApiResponse>
  summary(...args: [...Filters, userId?: string, searchString?: string]): Promise<Spec.HomeTaxTaxInvoiceSummaryApiResponse>
  getTaxinvoice(corpNum: string, ntsConfirmNum: string, userId?: string): Promise<Spec.HomeTaxTaxInvoiceApiModel>
  getXML(corpNum: string, ntsConfirmNum: string, userId?: string): Promise<Spec.HomeTaxTaxInvoiceXmlApiResponse>
  getPopUpURL(corpNum: string, ntsConfirmNum: string, userId?: string): Promise<string>
  getPrintURL(corpNum: string, ntsConfirmNum: string, userId?: string): Promise<string>
  getFlatRatePopUpURL(corpNum: string, userId?: string): Promise<string>
  getFlatRateState(corpNum: string, userId?: string): Promise<Spec.HomeTaxTaxInvoiceFlatRateStateApiModel>
  getChargeInfo(corpNum: string, userId?: string): Promise<Spec.HomeTaxTaxInvoiceChargeInfoApiResponse>
}
