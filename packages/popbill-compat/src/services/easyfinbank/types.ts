import type * as Spec from '@connextable/popbill-spec'
import type { LookupCallbackWithUserId } from '@/internal/lookup-types'

export interface EasyFinBankAccountForm extends Spec.EasyFinBankAccountFormApiModel {
  UsePeriod?: number
}
export interface EasyFinBankUpdateAccountForm extends Spec.EasyFinBankUpdateAccountFormApiModel {
  BankCode: string
  AccountNumber: string
}
type AccountArgs = [corpNum: string, bankCode: string, accountNumber: string]
type JobArgs = [corpNum: string, jobId: string]
type FilterArgs = [...JobArgs, tradeType: Spec.EasyFinBankTradeType[] | undefined, searchString: string | undefined]
type SearchArgs = [...FilterArgs, page: number | undefined, perPage: number | undefined, order: string | undefined]

export interface EasyFinBankUpdateAccountCallback
  extends
    LookupCallbackWithUserId<[corpNum: string, account: EasyFinBankUpdateAccountForm], Spec.EasyFinBankApiResponseBase>,
    LookupCallbackWithUserId<[...AccountArgs, account: Spec.EasyFinBankUpdateAccountFormApiModel], Spec.EasyFinBankApiResponseBase> {}

export interface EasyFinBankCallbackService {
  getBankAccountMgtURL: LookupCallbackWithUserId<[corpNum: string], string>
  registBankAccount: LookupCallbackWithUserId<[corpNum: string, account: EasyFinBankAccountForm], Spec.EasyFinBankApiResponseBase>
  updateBankAccount: EasyFinBankUpdateAccountCallback
  getBankAccountInfo: LookupCallbackWithUserId<AccountArgs, Spec.EasyFinBankAccountApiModel>
  listBankAccount: LookupCallbackWithUserId<[corpNum: string], Spec.EasyFinBankAccountApiModel[]>
  closeBankAccount: LookupCallbackWithUserId<[...AccountArgs, closeType: '중도' | '일반' | (string & {})], Spec.EasyFinBankApiResponseBase>
  revokeCloseBankAccount: LookupCallbackWithUserId<AccountArgs, Spec.EasyFinBankApiResponseBase>
  deleteBankAccount: LookupCallbackWithUserId<AccountArgs, Spec.EasyFinBankApiResponseBase>
  requestJob: LookupCallbackWithUserId<[...AccountArgs, startDate: string, endDate: string], string>
  getJobState: LookupCallbackWithUserId<JobArgs, Spec.EasyFinBankJobStateApiModel>
  listActiveJob: LookupCallbackWithUserId<[corpNum: string], Spec.EasyFinBankJobStateApiModel[]>
  search: LookupCallbackWithUserId<SearchArgs, Spec.EasyFinBankSearchResultApiModel>
  summary: LookupCallbackWithUserId<FilterArgs, Spec.EasyFinBankSummaryApiModel>
  saveMemo: LookupCallbackWithUserId<[corpNum: string, transactionId: string, memo: string], Spec.EasyFinBankApiResponseBase>
  getFlatRatePopUpURL: LookupCallbackWithUserId<[corpNum: string], string>
  getFlatRateState: LookupCallbackWithUserId<AccountArgs, Spec.EasyFinBankFlatRateApiModel>
  getChargeInfo: LookupCallbackWithUserId<[corpNum: string], Spec.EasyFinBankChargeInfoApiModel>
}

export interface EasyFinBankPromiseService {
  getBankAccountMgtURL(corpNum: string, userId?: string): Promise<string>
  registBankAccount(corpNum: string, account: EasyFinBankAccountForm, userId?: string): Promise<Spec.EasyFinBankApiResponseBase>
  updateBankAccount(corpNum: string, account: EasyFinBankUpdateAccountForm, userId?: string): Promise<Spec.EasyFinBankApiResponseBase>
  updateBankAccount(
    ...args: [...AccountArgs, account: Spec.EasyFinBankUpdateAccountFormApiModel, userId?: string]
  ): Promise<Spec.EasyFinBankApiResponseBase>
  getBankAccountInfo(...args: [...AccountArgs, userId?: string]): Promise<Spec.EasyFinBankAccountApiModel>
  listBankAccount(corpNum: string, userId?: string): Promise<Spec.EasyFinBankAccountApiModel[]>
  closeBankAccount(...args: [...AccountArgs, closeType: '중도' | '일반' | (string & {}), userId?: string]): Promise<Spec.EasyFinBankApiResponseBase>
  revokeCloseBankAccount(...args: [...AccountArgs, userId?: string]): Promise<Spec.EasyFinBankApiResponseBase>
  deleteBankAccount(...args: [...AccountArgs, userId?: string]): Promise<Spec.EasyFinBankApiResponseBase>
  requestJob(...args: [...AccountArgs, startDate: string, endDate: string, userId?: string]): Promise<string>
  getJobState(...args: [...JobArgs, userId?: string]): Promise<Spec.EasyFinBankJobStateApiModel>
  listActiveJob(corpNum: string, userId?: string): Promise<Spec.EasyFinBankJobStateApiModel[]>
  search(...args: [...SearchArgs, userId?: string]): Promise<Spec.EasyFinBankSearchResultApiModel>
  summary(...args: [...FilterArgs, userId?: string]): Promise<Spec.EasyFinBankSummaryApiModel>
  saveMemo(corpNum: string, transactionId: string, memo: string, userId?: string): Promise<Spec.EasyFinBankApiResponseBase>
  getFlatRatePopUpURL(corpNum: string, userId?: string): Promise<string>
  getFlatRateState(...args: [...AccountArgs, userId?: string]): Promise<Spec.EasyFinBankFlatRateApiModel>
  getChargeInfo(corpNum: string, userId?: string): Promise<Spec.EasyFinBankChargeInfoApiModel>
}
