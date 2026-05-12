import type { JusoApiError } from '@/errors'
import type { JusoService } from '@/services/juso'

/**
 * 주소링크 클라이언트 설정입니다.
 */
export interface JusoLinkClientConfig {
  /**
   * 링크허브 링크아이디입니다.
   */
  linkId: string

  /**
   * 링크허브 비밀키(base64)입니다.
   */
  secretKey: string

  /**
   * 연동회원 식별자입니다.
   */
  accessId: string

  /**
   * 주소링크 API 기본 URL 입니다.
   *
   * @default https://jusolink.linkhub.co.kr
   */
  apiBaseUrl?: string

  /**
   * 링크허브 인증 API 기본 URL 입니다.
   *
   * @default https://auth.linkhub.co.kr
   */
  authBaseUrl?: string

  /**
   * 토큰 사용 제한 아이피입니다.
   */
  forwardedIpAddress?: string

  /**
   * 로컬 UTC 시간 사용 여부입니다.
   *
   * @default true
   */
  useLocalTime?: boolean

  /**
   * 요청 제한시간(밀리초)입니다.
   *
   * @default 180000
   */
  requestTimeoutMilliseconds?: number

  /**
   * Accept-Language 헤더 값입니다.
   */
  acceptLanguage?: string

  /**
   * 에러 콜백입니다.
   */
  onError?: (error: JusoApiError) => void
}

/**
 * 주소링크 클라이언트입니다.
 */
export interface JusoLinkClient {
  /**
   * 서비스 그룹입니다.
   */
  services: {
    /**
     * 주소검색 서비스입니다.
     */
    juso: JusoService
  }
}
