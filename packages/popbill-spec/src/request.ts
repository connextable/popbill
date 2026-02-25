import type { PopbillApiRequestHeaders } from './headers'

/**
 * Popbill Common Request Raw Types
 */

/**
 * 팝빌 API 공통 요청(raw).
 *
 * `path/query/body/headers`를 전송 위치별로 분리하여 명세한다.
 */
export interface PopbillApiRequest<
  TPath = never,
  TQuery = never,
  TBody = never,
  THeaders = PopbillApiRequestHeaders,
> {
  /**
   * 팝빌회원 사업자번호.
   *
   * `-` 없이 입력한다.
   */
  corpNum: string

  /**
   * 팝빌회원 아이디.
   */
  userId?: string

  /**
   * URL path 파라미터(raw).
   */
  path?: TPath

  /**
   * URL query 파라미터(raw).
   */
  query?: TQuery

  /**
   * HTTP 요청 본문(raw).
   */
  body?: TBody

  /**
   * HTTP 요청 헤더(raw).
   */
  headers?: THeaders
}

/**
 * 요청 타입의 특정 필드를 필수화하는 유틸리티 타입.
 */
export type PopbillRequireRequestFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P]
}
