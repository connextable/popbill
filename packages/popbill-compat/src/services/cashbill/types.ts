import type * as Spec from '@connextable/popbill-spec'

type Success<T> = (response: T) => void
type Failure = (error: unknown) => void
type DefinedTail<A extends unknown[]> = A extends [...infer Head, infer Tail] ? [...Head, Exclude<Tail, undefined>] : A
interface LegacyCallback<A extends unknown[], R> {
  (...args: A): void
  (...args: [...DefinedTail<A>, success: Success<R> | undefined, error?: Failure]): void
  (...args: [...A, success: Success<R> | undefined, error: Failure | undefined]): void
}
type LegacyUserCallback<A extends unknown[], R> = LegacyCallback<A, R> & LegacyCallback<[...A, userId: string | undefined], R>
type DocumentArgs = [corpNum: string, mgtKey: string]
type RevokeArgs = [corpNum: string, mgtKey: string, orgConfirmNum: string, orgTradeDate: string]
type CancelType = Spec.CashbillCancelType | `${Spec.CashbillCancelType}` | null | undefined
type AmountArgs = [supplyCost: string | undefined, tax: string | undefined, serviceFee: string | undefined, totalAmount: string | undefined]
type SearchBaseArgs = [
  corpNum: string,
  dType: string,
  sDate: string,
  eDate: string,
  state: string[] | undefined,
  tradeType: string[] | undefined,
  tradeUsage: string[] | undefined,
]
type SearchLegacyArgs = [
  ...SearchBaseArgs,
  taxationType: string[] | undefined,
  order: string | undefined,
  page: number | undefined,
  perPage: number | undefined,
]
type SearchQueryArgs = [
  ...SearchBaseArgs,
  taxationType: string[] | undefined,
  qString: string | undefined,
  order: string | undefined,
  page: number | undefined,
  perPage: number | undefined,
]
type SearchArgs = [
  ...SearchBaseArgs,
  tradeOpt: string[] | undefined,
  taxationType: string[] | undefined,
  qString: string | undefined,
  order: string | undefined,
  page: number | undefined,
  perPage: number | undefined,
]
type IssueCallback = LegacyCallback<DocumentArgs, Spec.CashbillIssueApiResponse> &
  LegacyUserCallback<[...DocumentArgs, memo: string | undefined], Spec.CashbillIssueApiResponse>
type CancelCallback = LegacyCallback<DocumentArgs, Spec.CashbillApiResponseBase> &
  LegacyUserCallback<[...DocumentArgs, memo: string | undefined], Spec.CashbillApiResponseBase>
type RegistIssueCallback = LegacyCallback<[corpNum: string, cashbill: Spec.CashbillApiModel], Spec.CashbillRegistIssueApiResponse> &
  LegacyUserCallback<[corpNum: string, cashbill: Spec.CashbillApiModel, memo: string | undefined], Spec.CashbillRegistIssueApiResponse> &
  LegacyCallback<
    [corpNum: string, cashbill: Spec.CashbillApiModel, memo: string | undefined, userId: string | undefined, emailSubject: string | undefined],
    Spec.CashbillRegistIssueApiResponse
  >
type RevokeIssueCallback = LegacyCallback<RevokeArgs, Spec.CashbillRevokeRegistIssueApiResponse> &
  LegacyCallback<[...RevokeArgs, smsSendYN: boolean | undefined], Spec.CashbillRevokeRegistIssueApiResponse> &
  LegacyUserCallback<[...RevokeArgs, smsSendYN: boolean | undefined, memo: string | undefined], Spec.CashbillRevokeRegistIssueApiResponse> &
  LegacyCallback<
    [
      ...RevokeArgs,
      smsSendYN: boolean | undefined,
      memo: string | undefined,
      isPartCancel: boolean | undefined,
      cancelType: CancelType,
      ...AmountArgs,
    ],
    Spec.CashbillRevokeRegistIssueApiResponse
  > &
  LegacyCallback<
    [
      ...RevokeArgs,
      smsSendYN: boolean | undefined,
      memo: string | undefined,
      userId: string | undefined,
      isPartCancel: boolean | undefined,
      cancelType: CancelType,
      ...AmountArgs,
      emailSubject: string | undefined,
      tradeDT: string | undefined,
    ],
    Spec.CashbillRevokeRegistIssueApiResponse
  >
type RevokeRegisterCallback = LegacyCallback<RevokeArgs, Spec.CashbillApiResponseBase> &
  LegacyCallback<[...RevokeArgs, smsSendYN: boolean | undefined], Spec.CashbillApiResponseBase> &
  LegacyCallback<
    [
      ...RevokeArgs,
      smsSendYN: boolean | undefined,
      userId: string | undefined,
      isPartCancel: boolean | undefined,
      cancelType: CancelType,
      ...AmountArgs,
    ],
    Spec.CashbillApiResponseBase
  >

/** 레거시 현금영수증 이름과 위치 인자, callback 오버로드를 유지합니다. */
export interface CashbillCallbackService {
  registIssue: RegistIssueCallback
  revokeRegistIssue: RevokeIssueCallback
  bulkSubmit: LegacyUserCallback<[corpNum: string, submitId: string, cashbillList: Spec.CashbillApiModel[]], Spec.CashbillBulkSubmitApiResponse>
  getBulkResult: LegacyUserCallback<[corpNum: string, submitId: string], Spec.CashbillGetBulkResultApiResponse>
  register: LegacyUserCallback<[corpNum: string, cashbill: Spec.CashbillApiModel], Spec.CashbillApiResponseBase>
  revokeRegister: RevokeRegisterCallback
  update: LegacyUserCallback<[...DocumentArgs, cashbill: Spec.CashbillApiModel], Spec.CashbillApiResponseBase>
  issue: IssueCallback
  cancelIssue: CancelCallback
  delete: LegacyUserCallback<DocumentArgs, Spec.CashbillApiResponseBase>
  getInfo: LegacyUserCallback<DocumentArgs, Spec.CashbillInfoApiModel>
  getInfos: LegacyUserCallback<[corpNum: string, mgtKeyList: string[]], Spec.CashbillInfoApiModel[]>
  getDetailInfo: LegacyUserCallback<DocumentArgs, Spec.CashbillApiModel>
  checkMgtKeyInUse: LegacyUserCallback<DocumentArgs, boolean>
  search: LegacyCallback<SearchLegacyArgs, Spec.CashbillSearchApiResponse> &
    LegacyCallback<SearchQueryArgs, Spec.CashbillSearchApiResponse> &
    LegacyCallback<SearchArgs, Spec.CashbillSearchApiResponse> &
    LegacyUserCallback<[...SearchArgs, franchiseTaxRegID: string | undefined], Spec.CashbillSearchApiResponse>
  getLogs: LegacyUserCallback<DocumentArgs, Spec.CashbillLogApiModel[]>
  getURL: LegacyUserCallback<[corpNum: string, togo: string], string>
  getPopUpURL: LegacyUserCallback<DocumentArgs, string>
  getViewURL: LegacyUserCallback<DocumentArgs, string>
  getPrintURL: LegacyUserCallback<DocumentArgs, string>
  getEPrintURL: LegacyUserCallback<DocumentArgs, string>
  getMassPrintURL: LegacyUserCallback<[corpNum: string, mgtKeyList: string[]], string>
  getMailURL: LegacyUserCallback<DocumentArgs, string>
  getPDFURL: LegacyUserCallback<DocumentArgs, string>
  getPDF: LegacyUserCallback<DocumentArgs, Buffer>
  sendEmail: LegacyUserCallback<[...DocumentArgs, receiver: string], Spec.CashbillApiResponseBase>
  sendSMS: LegacyUserCallback<[...DocumentArgs, sender: string, receiver: string, contents: string], Spec.CashbillApiResponseBase>
  sendFAX: LegacyUserCallback<[...DocumentArgs, sender: string, receiver: string], Spec.CashbillApiResponseBase>
  assignMgtKey: LegacyUserCallback<[corpNum: string, itemKey: string, mgtKey: string], Spec.CashbillApiResponseBase>
  listEmailConfig: LegacyUserCallback<[corpNum: string], Spec.CashbillEmailConfigApiModel[]>
  updateEmailConfig: LegacyUserCallback<[corpNum: string, emailType: string, sendYN: boolean], Spec.CashbillApiResponseBase>
  getChargeInfo: LegacyUserCallback<[corpNum: string], Spec.CashbillChargeInfoApiResponse>
  getUnitCost: LegacyCallback<[corpNum: string], string>
}

export interface CashbillPromiseService {
  registIssue(
    corpNum: string,
    cashbill: Spec.CashbillApiModel,
    memo?: string,
    userId?: string,
    emailSubject?: string
  ): Promise<Spec.CashbillRegistIssueApiResponse>
  revokeRegistIssue(
    ...args: [
      ...RevokeArgs,
      smsSendYN: boolean | undefined,
      memo: string | undefined,
      isPartCancel: boolean | undefined,
      cancelType: CancelType,
      ...AmountArgs,
    ]
  ): Promise<Spec.CashbillRevokeRegistIssueApiResponse>
  revokeRegistIssue(
    ...args: [
      ...RevokeArgs,
      smsSendYN?: boolean,
      memo?: string,
      userId?: string,
      isPartCancel?: boolean,
      cancelType?: CancelType,
      supplyCost?: string,
      tax?: string,
      serviceFee?: string,
      totalAmount?: string,
      emailSubject?: string,
      tradeDT?: string,
    ]
  ): Promise<Spec.CashbillRevokeRegistIssueApiResponse>
  bulkSubmit(corpNum: string, submitId: string, cashbillList: Spec.CashbillApiModel[], userId?: string): Promise<Spec.CashbillBulkSubmitApiResponse>
  getBulkResult(corpNum: string, submitId: string, userId?: string): Promise<Spec.CashbillGetBulkResultApiResponse>
  register(corpNum: string, cashbill: Spec.CashbillApiModel, userId?: string): Promise<Spec.CashbillApiResponseBase>
  revokeRegister(
    ...args: [
      ...RevokeArgs,
      smsSendYN?: boolean,
      userId?: string,
      isPartCancel?: boolean,
      cancelType?: CancelType,
      supplyCost?: string,
      tax?: string,
      serviceFee?: string,
      totalAmount?: string,
    ]
  ): Promise<Spec.CashbillApiResponseBase>
  update(...args: [...DocumentArgs, cashbill: Spec.CashbillApiModel, userId?: string]): Promise<Spec.CashbillApiResponseBase>
  issue(...args: [...DocumentArgs, memo?: string, userId?: string]): Promise<Spec.CashbillIssueApiResponse>
  cancelIssue(...args: [...DocumentArgs, memo?: string, userId?: string]): Promise<Spec.CashbillApiResponseBase>
  delete(...args: [...DocumentArgs, userId?: string]): Promise<Spec.CashbillApiResponseBase>
  getInfo(...args: [...DocumentArgs, userId?: string]): Promise<Spec.CashbillInfoApiModel>
  getInfos(corpNum: string, mgtKeyList: string[], userId?: string): Promise<Spec.CashbillInfoApiModel[]>
  getDetailInfo(...args: [...DocumentArgs, userId?: string]): Promise<Spec.CashbillApiModel>
  checkMgtKeyInUse(...args: [...DocumentArgs, userId?: string]): Promise<boolean>
  search(...args: SearchLegacyArgs): Promise<Spec.CashbillSearchApiResponse>
  search(...args: SearchQueryArgs): Promise<Spec.CashbillSearchApiResponse>
  search(...args: [...SearchArgs, franchiseTaxRegID?: string, userId?: string]): Promise<Spec.CashbillSearchApiResponse>
  getLogs(...args: [...DocumentArgs, userId?: string]): Promise<Spec.CashbillLogApiModel[]>
  getURL(corpNum: string, togo: string, userId?: string): Promise<string>
  getPopUpURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getViewURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getPrintURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getEPrintURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getMassPrintURL(corpNum: string, mgtKeyList: string[], userId?: string): Promise<string>
  getMailURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getPDFURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getPDF(...args: [...DocumentArgs, userId?: string]): Promise<Buffer>
  sendEmail(...args: [...DocumentArgs, receiver: string, userId?: string]): Promise<Spec.CashbillApiResponseBase>
  sendSMS(...args: [...DocumentArgs, sender: string, receiver: string, contents: string, userId?: string]): Promise<Spec.CashbillApiResponseBase>
  sendFAX(...args: [...DocumentArgs, sender: string, receiver: string, userId?: string]): Promise<Spec.CashbillApiResponseBase>
  assignMgtKey(corpNum: string, itemKey: string, mgtKey: string, userId?: string): Promise<Spec.CashbillApiResponseBase>
  listEmailConfig(corpNum: string, userId?: string): Promise<Spec.CashbillEmailConfigApiModel[]>
  updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, userId?: string): Promise<Spec.CashbillApiResponseBase>
  getChargeInfo(corpNum: string, userId?: string): Promise<Spec.CashbillChargeInfoApiResponse>
  getUnitCost(corpNum: string): Promise<string>
}
