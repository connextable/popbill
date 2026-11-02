import type * as Spec from '@connextable/popbill-spec'

export interface FaxReceiver {
  receiveNum: string
  receiveName?: string
  interOPRefKey?: string
}
export interface FaxBinaryFile {
  fileName: string
  fileData: Buffer
}
export interface FaxSendOptions {
  RequestNum?: string
  SenderNum: string
  SenderName?: string
  Receiver: string | FaxReceiver | FaxReceiver[]
  ReceiverName?: string
  interOPRefKey?: string
  Title?: string
  AdsYN?: boolean
  ReserveDT?: string
  UserID?: string
}
export interface FaxSendFileOptions extends FaxSendOptions {
  FilePaths: string | string[]
}
export interface FaxSendBinaryOptions extends FaxSendOptions {
  BinaryFiles: FaxBinaryFile[]
}
export interface FaxResendOptions extends Partial<FaxSendOptions> {
  ReceiptNum?: string
  OrgRequestNum?: string
}

type Success<T> = (response: T) => void
type Failure = (error: unknown) => void
type DefinedTail<T extends unknown[]> = T extends [...infer Head, infer Tail] ? [...Head, Exclude<Tail, undefined>] : T
type UnionToIntersection<T> = (T extends unknown ? (value: T) => void : never) extends (value: infer Intersection) => void ? Intersection : never
type Callback<TArgs extends unknown[], TResult> = UnionToIntersection<
  TArgs extends unknown[]
    ? {
        (...args: TArgs): void
        (...args: [...DefinedTail<TArgs>, success: Success<TResult>]): void
        (...args: [...TArgs, success: Success<TResult> | undefined, error: Failure | undefined]): void
      }
    : never
>
type WithUserId<TArgs extends unknown[]> = TArgs | [...TArgs, userId: string | undefined]
type SendTail =
  | []
  | [senderName: string | undefined]
  | [senderName: string | undefined, adsYN: boolean | undefined]
  | [senderName: string | undefined, adsYN: boolean | undefined, title: string | undefined]
  | [senderName: string | undefined, adsYN: boolean | undefined, title: string | undefined, requestNum: string | undefined]
  | [
      senderName: string | undefined,
      adsYN: boolean | undefined,
      title: string | undefined,
      requestNum: string | undefined,
      userId: string | undefined,
    ]
type SendArgs<TFiles, TOptions> =
  | [corpNum: string, options: TOptions]
  | [corpNum: string, sender: string, receivers: FaxReceiver[], files: TFiles, reserveDT: string | undefined]
  | [
      corpNum: string,
      sender: string,
      receiver: string | FaxReceiver | FaxReceiver[],
      receiverName: string | undefined,
      files: TFiles,
      reserveDT: string | undefined,
      ...tail: SendTail,
    ]
type ResendTail =
  | []
  | [title: string | undefined]
  | [title: string | undefined, requestNum: string | undefined]
  | [title: string | undefined, requestNum: string | undefined, userId: string | undefined]
type ResendArgs =
  | [corpNum: string, options: FaxResendOptions]
  | [
      corpNum: string,
      originalNumber: string,
      sender: string | undefined,
      senderName: string | undefined,
      receivers: FaxReceiver[],
      reserveDT: string | undefined,
    ]
  | [
      corpNum: string,
      originalNumber: string,
      sender: string | undefined,
      senderName: string | undefined,
      receiver: string | FaxReceiver | FaxReceiver[] | undefined,
      receiverName: string | undefined,
      reserveDT: string | undefined,
      ...tail: ResendTail,
    ]
type ResendRequestArgs =
  | ResendArgs
  | [corpNum: string, originalRequestNum: string, requestNum: string | undefined, title: string | undefined]
  | [
      corpNum: string,
      originalRequestNum: string,
      sender: string | undefined,
      senderName: string | undefined,
      receivers: FaxReceiver[],
      reserveDT: string | undefined,
      title: string | undefined,
      requestNum: string | undefined,
    ]
  | [
      corpNum: string,
      originalRequestNum: string,
      receiver: string | undefined,
      receiverName: string | undefined,
      reserveDT: string | undefined,
      title: string | undefined,
      requestNum: string | undefined,
    ]
type CorpArgs = WithUserId<[corpNum: string]>
type NumberArgs = WithUserId<[corpNum: string, number: string]>
type ChargeArgs = [corpNum: string] | WithUserId<[corpNum: string, receiveNumType: Spec.FaxReceiveNumberType | '' | null | undefined]>
type SearchFilters = [
  corpNum: string,
  sDate: string,
  eDate: string,
  state: string[] | undefined,
  reserveYN: boolean | undefined,
  senderOnly: boolean | undefined,
  order: string | undefined,
  page: number | undefined,
  perPage: number | undefined,
]
type SearchArgs =
  | SearchFilters
  | [...SearchFilters, qString: string | undefined]
  | [...SearchFilters, qString: string | undefined, userId: string | undefined]

/** Legacy names and positional/callback contracts. Common member APIs are composed separately. */
export interface FaxCallbackService {
  getSenderNumberMgtURL: Callback<CorpArgs, string>
  getSenderNumberList: Callback<CorpArgs, Spec.FaxSenderNumberApiModel[]>
  checkSenderNumber: Callback<NumberArgs, Spec.FaxApiResponseBase>
  sendFax: Callback<SendArgs<string | string[], FaxSendFileOptions>, string>
  sendFaxBinary: Callback<SendArgs<FaxBinaryFile[], FaxSendBinaryOptions>, string>
  resendFax: Callback<ResendArgs, string>
  resendFaxRN: Callback<ResendRequestArgs, string>
  cancelReserve: Callback<NumberArgs, Spec.FaxApiResponseBase>
  cancelReserveRN: Callback<NumberArgs, Spec.FaxApiResponseBase>
  getFaxResult: Callback<NumberArgs, Spec.FaxResultApiModel[]>
  getFaxResultRN: Callback<NumberArgs, Spec.FaxResultApiModel[]>
  search: Callback<SearchArgs, Spec.FaxSearchResultApiModel>
  getURL: Callback<WithUserId<[corpNum: string, togo: string]>, string>
  getSentListURL: Callback<CorpArgs, string>
  getPreviewURL: Callback<NumberArgs, string>
  getUnitCost: Callback<ChargeArgs, string>
  getChargeInfo: Callback<ChargeArgs, Spec.FaxChargeInfoApiModel>
}
export interface FaxPromiseService {
  getSenderNumberMgtURL(...args: CorpArgs): Promise<string>
  getSenderNumberList(...args: CorpArgs): Promise<Spec.FaxSenderNumberApiModel[]>
  checkSenderNumber(...args: NumberArgs): Promise<Spec.FaxApiResponseBase>
  sendFax(...args: SendArgs<string | string[], FaxSendFileOptions>): Promise<string>
  sendFaxBinary(...args: SendArgs<FaxBinaryFile[], FaxSendBinaryOptions>): Promise<string>
  resendFax(...args: ResendArgs): Promise<string>
  resendFaxRN(...args: ResendRequestArgs): Promise<string>
  cancelReserve(...args: NumberArgs): Promise<Spec.FaxApiResponseBase>
  cancelReserveRN(...args: NumberArgs): Promise<Spec.FaxApiResponseBase>
  getFaxResult(...args: NumberArgs): Promise<Spec.FaxResultApiModel[]>
  getFaxResultRN(...args: NumberArgs): Promise<Spec.FaxResultApiModel[]>
  search(...args: SearchArgs): Promise<Spec.FaxSearchResultApiModel>
  getURL(...args: WithUserId<[corpNum: string, togo: string]>): Promise<string>
  getSentListURL(...args: CorpArgs): Promise<string>
  getPreviewURL(...args: NumberArgs): Promise<string>
  getUnitCost(...args: ChargeArgs): Promise<string>
  getChargeInfo(...args: ChargeArgs): Promise<Spec.FaxChargeInfoApiModel>
}
