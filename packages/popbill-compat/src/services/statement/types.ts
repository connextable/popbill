import type * as Spec from '@connextable/popbill-spec'

export type StatementItemCode = Spec.StatementItemCode | `${Spec.StatementItemCode}`
export interface StatementBinaryFile {
  fileName: string
  fileData: Buffer
}

type Success<T> = (response: T) => void
type Failure = (error: unknown) => void

interface LegacyCallback<TArgs extends unknown[], TResult> {
  (...args: TArgs): void
  (...args: [...TArgs, success: Success<TResult> | undefined, error?: Failure]): void
}

interface LegacyCallbackWithUserId<TArgs extends unknown[], TResult> extends LegacyCallback<TArgs, TResult> {
  (...args: [...TArgs, userId: string]): void
  (...args: [...TArgs, userId: string, success: Success<TResult> | undefined, error?: Failure]): void
  (...args: [...TArgs, userId: string | undefined, success: Success<TResult> | undefined, error: Failure | undefined]): void
}

interface LegacyFullCallback<TArgs extends unknown[], TResult> {
  (...args: TArgs): void
  (...args: [...TArgs, success: Success<TResult> | undefined, error: Failure | undefined]): void
}

interface LegacyCallbackWithOptionalMemo<TArgs extends unknown[], TResult> extends LegacyCallbackWithUserId<[...TArgs, memo: string], TResult> {
  (...args: [...TArgs, memo: undefined, success: Success<TResult> | undefined, error: Failure | undefined]): void
  (...args: [...TArgs, memo: undefined, userId: string | undefined, success: Success<TResult> | undefined, error: Failure | undefined]): void
}

type DocumentArgs = [corpNum: string, itemCode: StatementItemCode, mgtKey: string]
type KeysArgs = [corpNum: string, itemCode: StatementItemCode, mgtKeyList: string[]]
type AttachmentArgs = [...DocumentArgs, subItemCode: StatementItemCode, subMgtKey: string]
type SearchFilterArgs = [
  corpNum: string,
  dType: string,
  sDate: string,
  eDate: string,
  state: string[] | undefined,
  itemCode: StatementItemCode[] | undefined,
]
type SearchArgs = [...SearchFilterArgs, qString: string | undefined, order: string, page: number, perPage: number]
type ShortSearchArgs = [...SearchFilterArgs, order: string | undefined, page: number, perPage: number]
type SearchDefaultOrderArgs = [
  ...SearchFilterArgs,
  qString: string | undefined,
  order: undefined,
  page: number | undefined,
  perPage: number | undefined,
  userId: string | undefined,
]
interface LegacySearchOptionalCallback<TArgs extends unknown[]> {
  (...args: [...TArgs, page?: number, perPage?: number, userId?: string]): void
  (...args: [...TArgs, success: Success<Spec.StatementSearchApiResponse> | undefined, error: Failure | undefined]): void
  (...args: [...TArgs, page: number | undefined, success: Success<Spec.StatementSearchApiResponse> | undefined, error: Failure | undefined]): void
  (
    ...args: [
      ...TArgs,
      page: number | undefined,
      perPage: number | undefined,
      success: Success<Spec.StatementSearchApiResponse> | undefined,
      error: Failure | undefined,
    ]
  ): void
  (
    ...args: [
      ...TArgs,
      page: number | undefined,
      perPage: number | undefined,
      userId: string | undefined,
      success: Success<Spec.StatementSearchApiResponse> | undefined,
      error: Failure | undefined,
    ]
  ): void
}
type StatementSearchCallback = LegacyCallbackWithUserId<SearchArgs, Spec.StatementSearchApiResponse> &
  LegacyCallbackWithUserId<ShortSearchArgs, Spec.StatementSearchApiResponse> &
  LegacySearchOptionalCallback<[...SearchFilterArgs, qString: string | undefined, order: string]> &
  LegacySearchOptionalCallback<[...SearchFilterArgs, order: string | undefined]> &
  LegacyFullCallback<SearchDefaultOrderArgs, Spec.StatementSearchApiResponse>

type StatementIssueCallback = LegacyCallback<DocumentArgs, Spec.StatementIssueApiResponse> &
  LegacyCallbackWithOptionalMemo<DocumentArgs, Spec.StatementIssueApiResponse> &
  LegacyFullCallback<
    [...DocumentArgs, memo: string | undefined, emailSubject: string | undefined, userId: string | undefined],
    Spec.StatementIssueApiResponse
  >

type StatementRegistIssueCallback = LegacyCallback<[corpNum: string, statement: Spec.StatementApiModel], Spec.StatementRegistIssueApiResponse> &
  LegacyCallbackWithOptionalMemo<[corpNum: string, statement: Spec.StatementApiModel], Spec.StatementRegistIssueApiResponse> &
  LegacyFullCallback<
    [corpNum: string, statement: Spec.StatementApiModel, memo: string | undefined, userId: string | undefined, emailSubject: string | undefined],
    Spec.StatementRegistIssueApiResponse
  >

/** Legacy callback entrypoint. Shared member and point APIs are outside this service. */
export interface StatementCallbackService {
  registIssue: StatementRegistIssueCallback
  register: LegacyCallbackWithUserId<[corpNum: string, statement: Spec.StatementApiModel], Spec.StatementApiResponseBase>
  update: LegacyCallbackWithUserId<[...DocumentArgs, statement: Spec.StatementApiModel], Spec.StatementApiResponseBase>
  issue: StatementIssueCallback
  cancel: LegacyCallback<DocumentArgs, Spec.StatementApiResponseBase> &
    LegacyCallbackWithOptionalMemo<DocumentArgs, Spec.StatementApiResponseBase> &
    LegacyFullCallback<[...DocumentArgs, memo: string | undefined, userId: string | undefined], Spec.StatementApiResponseBase>
  delete: LegacyCallbackWithUserId<DocumentArgs, Spec.StatementApiResponseBase>
  getInfo: LegacyCallbackWithUserId<DocumentArgs, Spec.StatementInfoApiModel>
  getInfos: LegacyCallbackWithUserId<KeysArgs, Spec.StatementInfoApiModel[]>
  getDetailInfo: LegacyCallbackWithUserId<DocumentArgs, Spec.StatementApiModel>
  checkMgtKeyInUse: LegacyCallbackWithUserId<DocumentArgs, boolean>
  search: StatementSearchCallback
  getLogs: LegacyCallbackWithUserId<DocumentArgs, Spec.StatementLogApiModel[]>
  getURL: LegacyCallbackWithUserId<[corpNum: string, togo: string], string>
  getPopUpURL: LegacyCallbackWithUserId<DocumentArgs, string>
  getViewURL: LegacyCallbackWithUserId<DocumentArgs, string>
  getPrintURL: LegacyCallbackWithUserId<DocumentArgs, string>
  getEPrintURL: LegacyCallbackWithUserId<DocumentArgs, string>
  getMassPrintURL: LegacyCallbackWithUserId<KeysArgs, string>
  getMailURL: LegacyCallbackWithUserId<DocumentArgs, string>
  getSealURL: LegacyCallbackWithUserId<[corpNum: string], string>
  attachFile: LegacyCallbackWithUserId<[...DocumentArgs, displayName: string, filePath: string], Spec.StatementApiResponseBase>
  attachFileBinary: LegacyCallbackWithUserId<[...DocumentArgs, binaryFile: StatementBinaryFile], Spec.StatementApiResponseBase>
  deleteFile: LegacyCallbackWithUserId<[...DocumentArgs, fileId: string], Spec.StatementApiResponseBase>
  getFiles: LegacyCallbackWithUserId<DocumentArgs, Spec.StatementFileApiModel[]>
  sendEmail: LegacyCallbackWithUserId<[...DocumentArgs, receiver: string], Spec.StatementApiResponseBase>
  sendSMS: LegacyCallbackWithUserId<[...DocumentArgs, sender: string, receiver: string, contents: string], Spec.StatementApiResponseBase>
  sendFAX: LegacyCallbackWithUserId<[...DocumentArgs, sender: string, receiver: string], Spec.StatementApiResponseBase>
  FAXSend: LegacyCallbackWithUserId<[corpNum: string, statement: Spec.StatementApiModel, sendNum: string, receiveNum: string], string>
  attachStatement: LegacyCallbackWithUserId<AttachmentArgs, Spec.StatementApiResponseBase>
  detachStatement: LegacyCallbackWithUserId<AttachmentArgs, Spec.StatementApiResponseBase>
  listEmailConfig: LegacyCallbackWithUserId<[corpNum: string], Spec.StatementEmailConfigApiModel[]>
  updateEmailConfig: LegacyCallbackWithUserId<[corpNum: string, emailType: string, sendYN: boolean], Spec.StatementApiResponseBase>
  getChargeInfo: LegacyCallbackWithUserId<[corpNum: string, itemCode: StatementItemCode], Spec.StatementChargeInfoApiResponse>
  getUnitCost: LegacyCallbackWithUserId<[corpNum: string, itemCode: StatementItemCode], string>
}

/** Positional Promise interface matching the legacy StatementService argument order. */
export interface StatementPromiseService {
  registIssue(
    corpNum: string,
    statement: Spec.StatementApiModel,
    memo?: string,
    userId?: string,
    emailSubject?: string
  ): Promise<Spec.StatementRegistIssueApiResponse>
  register(corpNum: string, statement: Spec.StatementApiModel, userId?: string): Promise<Spec.StatementApiResponseBase>
  update(...args: [...DocumentArgs, statement: Spec.StatementApiModel, userId?: string]): Promise<Spec.StatementApiResponseBase>
  issue(...args: [...DocumentArgs, memo?: string, emailSubject?: string, userId?: string]): Promise<Spec.StatementIssueApiResponse>
  cancel(...args: [...DocumentArgs, memo?: string, userId?: string]): Promise<Spec.StatementApiResponseBase>
  delete(...args: [...DocumentArgs, userId?: string]): Promise<Spec.StatementApiResponseBase>
  getInfo(...args: [...DocumentArgs, userId?: string]): Promise<Spec.StatementInfoApiModel>
  getInfos(...args: [...KeysArgs, userId?: string]): Promise<Spec.StatementInfoApiModel[]>
  getDetailInfo(...args: [...DocumentArgs, userId?: string]): Promise<Spec.StatementApiModel>
  checkMgtKeyInUse(...args: [...DocumentArgs, userId?: string]): Promise<boolean>
  search(
    ...args: [...SearchFilterArgs, qString: string | undefined, order: string, page?: number, perPage?: number, userId?: string]
  ): Promise<Spec.StatementSearchApiResponse>
  search(
    ...args: [...SearchFilterArgs, order: string | undefined, page?: number, perPage?: number, userId?: string]
  ): Promise<Spec.StatementSearchApiResponse>
  /** When full-form Order is undefined, retain every slot through userId to distinguish it from the short form. */
  search(...args: SearchDefaultOrderArgs): Promise<Spec.StatementSearchApiResponse>
  getLogs(...args: [...DocumentArgs, userId?: string]): Promise<Spec.StatementLogApiModel[]>
  getURL(corpNum: string, togo: string, userId?: string): Promise<string>
  getPopUpURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getViewURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getPrintURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getEPrintURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getMassPrintURL(...args: [...KeysArgs, userId?: string]): Promise<string>
  getMailURL(...args: [...DocumentArgs, userId?: string]): Promise<string>
  getSealURL(corpNum: string, userId?: string): Promise<string>
  attachFile(...args: [...DocumentArgs, displayName: string, filePath: string, userId?: string]): Promise<Spec.StatementApiResponseBase>
  attachFileBinary(...args: [...DocumentArgs, binaryFile: StatementBinaryFile, userId?: string]): Promise<Spec.StatementApiResponseBase>
  deleteFile(...args: [...DocumentArgs, fileId: string, userId?: string]): Promise<Spec.StatementApiResponseBase>
  getFiles(...args: [...DocumentArgs, userId?: string]): Promise<Spec.StatementFileApiModel[]>
  sendEmail(...args: [...DocumentArgs, receiver: string, userId?: string]): Promise<Spec.StatementApiResponseBase>
  sendSMS(...args: [...DocumentArgs, sender: string, receiver: string, contents: string, userId?: string]): Promise<Spec.StatementApiResponseBase>
  sendFAX(...args: [...DocumentArgs, sender: string, receiver: string, userId?: string]): Promise<Spec.StatementApiResponseBase>
  FAXSend(corpNum: string, statement: Spec.StatementApiModel, sendNum: string, receiveNum: string, userId?: string): Promise<string>
  attachStatement(...args: [...AttachmentArgs, userId?: string]): Promise<Spec.StatementApiResponseBase>
  detachStatement(...args: [...AttachmentArgs, userId?: string]): Promise<Spec.StatementApiResponseBase>
  listEmailConfig(corpNum: string, userId?: string): Promise<Spec.StatementEmailConfigApiModel[]>
  updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, userId?: string): Promise<Spec.StatementApiResponseBase>
  getChargeInfo(corpNum: string, itemCode: StatementItemCode, userId?: string): Promise<Spec.StatementChargeInfoApiResponse>
  getUnitCost(corpNum: string, itemCode: StatementItemCode, userId?: string): Promise<string>
}
