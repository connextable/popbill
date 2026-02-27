/**
 * Popbill Common Header Raw Types
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/getting-started/authorization
 * - https://developers.popbill.com/api-reference/taxinvoice/getting-started/etc-header
 */

/**
 * Bearer 인증 헤더 값(raw).
 *
 * HTTP 헤더 `Authorization: Bearer {session_token}` 형식으로 전달한다.
 */
export type PopbillAuthorizationHeader = `Bearer ${string}`

/**
 * 응답 압축 설정 헤더 값(raw).
 *
 * 문서 기본값은 `gzip`이며, 런타임 호환을 위해 일반 문자열 확장을 허용한다.
 */
export interface PopbillAcceptEncodingMap {
  /**
   * Gzip 압축 응답.
   */
  Gzip: 'gzip'
}

/**
 * 응답 압축 설정 헤더 값(raw).
 *
 * 문서 기본값은 `gzip`이며, 런타임 호환을 위해 일반 문자열 확장을 허용한다.
 */
export type PopbillAcceptEncoding = PopbillAcceptEncodingMap[keyof PopbillAcceptEncodingMap] | (string & {})

/**
 * 팝빌 응답 메시지 기본 언어(raw).
 *
 * `Accept-Language` 헤더를 생략하면 기본값 `ko-KR`(한글)로 응답한다.
 */
export const PopbillDefaultResponseLanguage = 'ko-KR' as const

/**
 * 응답 언어 설정 헤더 값(raw).
 *
 * 기본은 `ko-KR`이며, `en-US`를 설정하면 영문 응답을 요청할 수 있다.
 */
export interface PopbillAcceptLanguageMap {
  /**
   * 한글 응답.
   */
  KoreanKorea: typeof PopbillDefaultResponseLanguage

  /**
   * 영문 응답.
   */
  EnglishUnitedStates: 'en-US'
}

/**
 * 응답 언어 설정 헤더 값 상수(raw).
 */
export const PopbillAcceptLanguages = {
  KoreanKorea: PopbillDefaultResponseLanguage,
  EnglishUnitedStates: 'en-US',
} as const satisfies PopbillAcceptLanguageMap

/**
 * 응답 언어 설정 헤더 값(raw).
 *
 * `Accept-Language` 헤더는 선택사항이다.
 * 헤더를 명시할 때는 `ko-KR` 또는 `en-US`를 사용한다.
 */
export type PopbillAcceptLanguage = (typeof PopbillAcceptLanguages)[keyof typeof PopbillAcceptLanguages]

/**
 * X-HTTP-Method-Override 헤더 값(raw).
 */
export const PopbillHttpMethodOverrides = {
  BulkIssue: 'BULKISSUE',
} as const

/**
 * X-HTTP-Method-Override 헤더 값(raw).
 */
export type PopbillHttpMethodOverride = (typeof PopbillHttpMethodOverrides)[keyof typeof PopbillHttpMethodOverrides]

/**
 * 팝빌 공통 API 요청 헤더(raw).
 */
export interface PopbillApiRequestHeaders {
  /**
   * 세션 토큰 기반 Bearer 인증 헤더.
   */
  Authorization?: PopbillAuthorizationHeader

  /**
   * 응답 압축 방식.
   *
   * HTTP 헤더 `Accept-Encoding`으로 전달한다.
   */
  AcceptEncoding?: PopbillAcceptEncoding

  /**
   * 응답 메시지 언어.
   *
   * HTTP 헤더 `Accept-Language`로 전달한다.
   * 헤더를 생략하면 기본 한글(`ko-KR`) 응답을 사용한다.
   */
  AcceptLanguage?: PopbillAcceptLanguage
}

/**
 * 대량발행(Bulk) 요청 헤더(raw).
 */
export interface PopbillBulkIssueRequestHeaders extends PopbillApiRequestHeaders {
  /**
   * 대량발행 API 메서드 오버라이드.
   *
   * HTTP 헤더 `X-HTTP-Method-Override`로 전달한다.
   */
  MethodOverride: PopbillHttpMethodOverride

  /**
   * 요청 본문 무결성 검증용 Message Digest.
   *
   * HTTP 헤더 `X-PB-MESSAGE-DIGEST`로 전달한다.
   */
  MessageDigest: string

  /**
   * 파트너가 할당한 제출아이디.
   *
   * HTTP 헤더 `X-PB-SUBMIT-ID`로 전달한다.
   */
  SubmitID: string
}
