import type * as Spec from '@connextable/popbill-spec'

type Success<T> = (response: T) => void
type Failure = (error: unknown) => void
/** Node 레거시 문서의 환불 DTO와 HTTP 문서의 필드명을 모두 허용합니다. */
export type CommonRefundForm =
  | Spec.CommonRefundFormApiModel
  | {
      AccountBank: string
      AccountNum: string
      AccountName: string
      RequestPoint: string
      ContactName: string
      tel: string
      Reason?: string
    }
interface Callback<A extends unknown[], R> {
  (...args: A): void
  (...args: [...A, success: Success<R> | undefined, error?: Failure]): void
}
interface WithUser<A extends unknown[], R> extends Callback<A, R> {
  (...args: [...A, userId: string]): void
  (...args: [...A, userId: string, success: Success<R> | undefined, error?: Failure]): void
  (...args: [...A, userId: string | undefined, success: Success<R> | undefined, error: Failure | undefined]): void
}
interface WithExplicitCallback<A extends unknown[], R> {
  (...args: A): void
  (...args: [...A, success: Success<R> | undefined, error: Failure | undefined]): void
  (...args: [...A, userId: string]): void
  (...args: [...A, userId: string, success: Success<R> | undefined, error?: Failure]): void
  (...args: [...A, userId: string | undefined, success: Success<R> | undefined, error: Failure | undefined]): void
}
type PageCallback<A extends unknown[], R> = WithUser<[...A, page: number | undefined, perPage: number], R> &
  WithExplicitCallback<[...A, page: number | undefined, perPage: undefined], R>
type ContactCallback<T> = Callback<[corpNum: string, contact: T], Spec.CommonOperationApiResponse> &
  Callback<[corpNum: string, userId: string | undefined, contact: T], Spec.CommonOperationApiResponse>
type PageArgs = [page: number | undefined, perPage: number | undefined]
type DateArgs = [corpNum: string, startDate: string, endDate: string, ...PageArgs]

/** BaseService가 모든 레거시 서비스에 제공한 회원·포인트 API입니다. */
export interface CommonCallbackService {
  checkIsMember: Callback<[corpNum: string], Spec.CommonOperationApiResponse>
  checkID: Callback<[id: string], Spec.CommonOperationApiResponse>
  joinMember: Callback<[form: Spec.CommonJoinFormApiModel], Spec.CommonOperationApiResponse>
  quitMember: WithUser<[corpNum: string, reason: string], Spec.CommonOperationApiResponse>
  getCorpInfo: WithUser<[corpNum: string], Spec.CommonCorpInfoApiModel>
  updateCorpInfo: Callback<[corpNum: string, info: Spec.CommonCorpInfoApiModel], Spec.CommonOperationApiResponse> &
    Callback<[corpNum: string, userId: string | undefined, info: Spec.CommonCorpInfoApiModel], Spec.CommonOperationApiResponse>
  registContact: ContactCallback<Spec.CommonRegisterContactApiModel>
  getContactInfo: WithUser<[corpNum: string, contactId: string], Spec.CommonContactApiModel>
  listContact: WithUser<[corpNum: string], Spec.CommonContactApiModel[]>
  updateContact: ContactCallback<Spec.CommonContactInputApiModel>
  deleteContact: Callback<[corpNum: string, targetUserId: string, userId: string], Spec.CommonOperationApiResponse>
  getAccessURL: WithUser<[corpNum: string], string>
  getPopbillURL: Callback<[corpNum: string, toGo: string], string> & Callback<[corpNum: string, userId: string | undefined, toGo: string], string>
  getBalance: Callback<[corpNum: string], string>
  getPartnerBalance: Callback<[corpNum: string], string>
  getChargeURL: WithUser<[corpNum: string], string>
  getPartnerURL: Callback<[corpNum: string, toGo: string], string>
  paymentRequest: WithUser<[corpNum: string, form: Spec.CommonPaymentFormApiModel], Spec.CommonRequestPaymentApiResponse>
  getSettleResult: WithUser<[corpNum: string, settlementCode: string], Spec.CommonPaymentHistoryApiModel>
  getPaymentHistory: PageCallback<[corpNum: string, startDate: string, endDate: string], Spec.CommonGetPaymentHistoryApiResponse>
  getPaymentURL: WithUser<[corpNum: string], string>
  getUseHistory: WithUser<[...DateArgs, order: string], Spec.CommonGetUseHistoryApiResponse> &
    WithExplicitCallback<[...DateArgs, order: undefined], Spec.CommonGetUseHistoryApiResponse>
  getUseHistoryURL: WithUser<[corpNum: string], string>
  getRefundableBalance: WithUser<[corpNum: string], Spec.CommonRefundableBalanceApiResponse>
  refund: WithUser<[corpNum: string, form: CommonRefundForm], Spec.CommonRequestRefundApiResponse>
  getRefundInfo: WithUser<[corpNum: string, refundCode: string], Spec.CommonRefundHistoryApiModel>
  getRefundHistory: PageCallback<[corpNum: string], Spec.CommonGetRefundHistoryApiResponse>
}

export interface CommonPromiseService {
  checkIsMember(corpNum: string): Promise<Spec.CommonOperationApiResponse>
  checkID(id: string): Promise<Spec.CommonOperationApiResponse>
  joinMember(form: Spec.CommonJoinFormApiModel): Promise<Spec.CommonOperationApiResponse>
  quitMember(corpNum: string, reason: string, userId?: string): Promise<Spec.CommonOperationApiResponse>
  getCorpInfo(corpNum: string, userId?: string): Promise<Spec.CommonCorpInfoApiModel>
  updateCorpInfo(corpNum: string, info: Spec.CommonCorpInfoApiModel): Promise<Spec.CommonOperationApiResponse>
  updateCorpInfo(corpNum: string, userId: string | undefined, info: Spec.CommonCorpInfoApiModel): Promise<Spec.CommonOperationApiResponse>
  registContact(corpNum: string, contact: Spec.CommonRegisterContactApiModel): Promise<Spec.CommonOperationApiResponse>
  registContact(corpNum: string, userId: string | undefined, contact: Spec.CommonRegisterContactApiModel): Promise<Spec.CommonOperationApiResponse>
  getContactInfo(corpNum: string, contactId: string, userId?: string): Promise<Spec.CommonContactApiModel>
  listContact(corpNum: string, userId?: string): Promise<Spec.CommonContactApiModel[]>
  updateContact(corpNum: string, contact: Spec.CommonContactInputApiModel): Promise<Spec.CommonOperationApiResponse>
  updateContact(corpNum: string, userId: string | undefined, contact: Spec.CommonContactInputApiModel): Promise<Spec.CommonOperationApiResponse>
  deleteContact(corpNum: string, targetUserId: string, userId: string): Promise<Spec.CommonOperationApiResponse>
  getAccessURL(corpNum: string, userId?: string): Promise<string>
  getPopbillURL(corpNum: string, toGo: string): Promise<string>
  getPopbillURL(corpNum: string, userId: string | undefined, toGo: string): Promise<string>
  getBalance(corpNum: string): Promise<string>
  getPartnerBalance(corpNum: string): Promise<string>
  getChargeURL(corpNum: string, userId?: string): Promise<string>
  getPartnerURL(corpNum: string, toGo: string): Promise<string>
  paymentRequest(corpNum: string, form: Spec.CommonPaymentFormApiModel, userId?: string): Promise<Spec.CommonRequestPaymentApiResponse>
  getSettleResult(corpNum: string, settlementCode: string, userId?: string): Promise<Spec.CommonPaymentHistoryApiModel>
  getPaymentHistory(
    corpNum: string,
    startDate: string,
    endDate: string,
    page?: number,
    perPage?: number,
    userId?: string
  ): Promise<Spec.CommonGetPaymentHistoryApiResponse>
  getPaymentURL(corpNum: string, userId?: string): Promise<string>
  getUseHistory(
    corpNum: string,
    startDate: string,
    endDate: string,
    page?: number,
    perPage?: number,
    order?: string,
    userId?: string
  ): Promise<Spec.CommonGetUseHistoryApiResponse>
  getUseHistoryURL(corpNum: string, userId?: string): Promise<string>
  getRefundableBalance(corpNum: string, userId?: string): Promise<Spec.CommonRefundableBalanceApiResponse>
  refund(corpNum: string, form: CommonRefundForm, userId?: string): Promise<Spec.CommonRequestRefundApiResponse>
  getRefundInfo(corpNum: string, refundCode: string, userId?: string): Promise<Spec.CommonRefundHistoryApiModel>
  getRefundHistory(corpNum: string, page?: number, perPage?: number, userId?: string): Promise<Spec.CommonGetRefundHistoryApiResponse>
}
