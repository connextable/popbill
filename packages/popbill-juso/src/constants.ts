/**
 * 주소링크 기본 URL 상수입니다.
 */
export const JusoLinkBaseUrls = {
  /**
   * 주소링크 API 기본 URL 입니다.
   */
  Api: 'https://jusolink.linkhub.co.kr',
  /**
   * 링크허브 인증 API 기본 URL 입니다.
   */
  Auth: 'https://auth.linkhub.co.kr',
} as const

/**
 * 주소링크 검색 기본값 상수입니다.
 */
export const JusoLinkSearchDefaults = {
  /**
   * 기본 페이지 번호입니다.
   */
  PageNumber: 1,
  /**
   * 기본 페이지 크기입니다.
   */
  PageSize: 20,
  /**
   * 허용되는 최대 페이지 크기입니다.
   */
  MaximumPageSize: 100,
  /**
   * 기본 차등검색 사용 여부입니다.
   */
  DisableDifferentialSearch: false,
  /**
   * 기본 수정 제시어 사용 여부입니다.
   */
  DisableSuggestion: false,
} as const

/**
 * 주소링크 SDK 기본 요청 제한시간(밀리초)입니다.
 */
export const JusoLinkDefaultRequestTimeoutMilliseconds = 180_000 as const

/**
 * 주소링크 SDK 기본 사용자 에이전트입니다.
 */
export const JusoLinkUserAgent = 'NODEJS JUSOLINK SDK' as const
