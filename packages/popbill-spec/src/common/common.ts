import type { PopbillApiRequestHeaders } from '../headers'
import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

/** 회원·포인트 API의 원시 HTTP 요청입니다. */
export type CommonApiRequest<TPath = never, TQuery = never, TBody = never> = PopbillApiRequest<TPath, TQuery, TBody, PopbillApiRequestHeaders>
/** 가입 전 조회·가입 API는 회원 인증 토큰 및 사용자 ID를 사용하지 않습니다. */
export type CommonUnauthenticatedApiRequest<TPath = never, TQuery = never, TBody = never> = Omit<
  PopbillApiRequest<TPath, TQuery, TBody, Omit<PopbillApiRequestHeaders, 'Authorization'>>,
  'corpNum' | 'userId'
>
export type CommonRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>
export interface CommonOperationApiResponse {
  code: number
  message: string
}
export interface CommonUrlApiResponse {
  url: string
}
export interface CommonPointApiResponse {
  remainPoint: string
  defUsedPoint?: string
}
export interface CommonRefundableBalanceApiResponse {
  refundableBalance: string
}
export interface CommonPageApiResponse<T> {
  code: number
  message?: string
  pageNum: number
  perPage: number
  pageCount: number
  total: number
  list: T[]
}
export interface CommonPageApiQuery {
  Page?: number
  PerPage?: number
}
export interface CommonHistoryApiQuery {
  SDate: string
  EDate: string
  Page?: number
  PerPage?: number
}
