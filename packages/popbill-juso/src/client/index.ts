import type { JusoLinkClient, JusoLinkClientConfig } from './types'
import {
  createLinkhubAuthClient,
  createLinkhubRequestClient,
  createTokenProvider,
  LinkhubAuthScope,
  LinkhubServiceIds,
} from '@connextable/popbill-runtime'
import type { LinkhubAuthScope as LinkhubAuthScopeType } from '@connextable/popbill-runtime'
import { JusoLinkBaseUrls, JusoLinkDefaultRequestTimeoutMilliseconds, JusoLinkUserAgent } from '@/constants'
import { createJusoService } from '@/services/juso'
import { normalizeOptionalString, normalizeRequiredString, trimTrailingSlash } from '@connextable/popbill-utils'

export type { JusoLinkClient, JusoLinkClientConfig } from './types'

interface ResolvedJusoLinkClientConfig {
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
   */
  apiBaseUrl: string

  /**
   * 링크허브 인증 API 기본 URL 입니다.
   */
  authBaseUrl: string

  /**
   * 토큰 권한 범위 목록입니다.
   */
  tokenScopes: readonly LinkhubAuthScopeType[]

  /**
   * 토큰 사용 제한 아이피입니다.
   */
  forwardedIpAddress?: string

  /**
   * 로컬 UTC 시간 사용 여부입니다.
   */
  useLocalTime: boolean

  /**
   * 요청 제한시간(밀리초)입니다.
   */
  requestTimeoutMilliseconds: number

  /**
   * Accept-Language 헤더 값입니다.
   */
  acceptLanguage?: string

  /**
   * SDK 에러 콜백입니다.
   */
  onError?: JusoLinkClientConfig['onError']
}

/**
 * 주소링크 클라이언트를 생성합니다.
 */
export function createJusoLinkClient(configuration: JusoLinkClientConfig): JusoLinkClient {
  const resolvedConfiguration = resolveConfiguration(configuration)

  const authClient = createLinkhubAuthClient({
    linkId: resolvedConfiguration.linkId,
    secretKey: resolvedConfiguration.secretKey,
    authBaseUrl: resolvedConfiguration.authBaseUrl,
    useLocalTime: resolvedConfiguration.useLocalTime,
    timeoutMs: resolvedConfiguration.requestTimeoutMilliseconds,
  })

  const tokenProvider = createTokenProvider({
    authClient,
    serviceId: LinkhubServiceIds.JusoLink,
    scopes: resolvedConfiguration.tokenScopes,
    forwardedIp: resolvedConfiguration.forwardedIpAddress,
  })

  const requestClient = createLinkhubRequestClient({
    apiBaseUrl: resolvedConfiguration.apiBaseUrl,
    timeoutMs: resolvedConfiguration.requestTimeoutMilliseconds,
    tokenProvider,
    tokenCacheKey: resolvedConfiguration.accessId,
    acceptLanguage: resolvedConfiguration.acceptLanguage,
    userAgent: JusoLinkUserAgent,
  })

  return {
    services: {
      juso: createJusoService({
        requestClient,
        onError: resolvedConfiguration.onError,
      }),
    },
  }
}

function resolveConfiguration(configuration: JusoLinkClientConfig): ResolvedJusoLinkClientConfig {
  const linkId = normalizeRequiredString(configuration.linkId, 'linkId는 필수입니다.')
  const secretKey = normalizeRequiredString(configuration.secretKey, 'secretKey는 필수입니다.')
  const accessId = normalizeRequiredString(configuration.accessId, 'accessId는 필수입니다.')

  return {
    linkId,
    secretKey,
    accessId,
    apiBaseUrl: trimTrailingSlash(configuration.apiBaseUrl ?? JusoLinkBaseUrls.Api),
    authBaseUrl: trimTrailingSlash(configuration.authBaseUrl ?? JusoLinkBaseUrls.Auth),
    tokenScopes: normalizeTokenScopes(configuration.tokenScopes),
    forwardedIpAddress: normalizeOptionalString(configuration.forwardedIpAddress),
    useLocalTime: configuration.useLocalTime ?? true,
    requestTimeoutMilliseconds: normalizeRequestTimeoutMilliseconds(configuration.requestTimeoutMilliseconds),
    acceptLanguage: normalizeOptionalString(configuration.acceptLanguage),
    onError: configuration.onError,
  }
}

function normalizeRequestTimeoutMilliseconds(value: number | undefined): number {
  if (value === undefined) {
    return JusoLinkDefaultRequestTimeoutMilliseconds
  }

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('requestTimeoutMilliseconds는 1 이상의 정수여야 합니다.')
  }

  return value
}

function normalizeTokenScopes(value: readonly LinkhubAuthScopeType[] | undefined): readonly LinkhubAuthScopeType[] {
  if (value === undefined) {
    return [LinkhubAuthScope.Member]
  }

  if (value.length === 0) {
    throw new Error('tokenScopes는 최소 1개 이상이어야 합니다.')
  }

  for (const scope of value) {
    normalizeRequiredString(scope, 'tokenScopes 항목은 비어 있을 수 없습니다.')
  }

  return [...value]
}
