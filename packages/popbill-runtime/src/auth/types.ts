import type * as Spec from '@connextable/popbill-spec'
import type { RequestCallOptions, RequestContext } from '../api/request-context'

export type LinkhubTokenApiResponse = Spec.LinkhubIssueTokenApiResponse

export interface LinkhubTokenResponse {
  sessionToken: string
  serviceId: Spec.PopbillIssueTokenApiResponse['serviceID']
  linkId: string
  userId: string
  partnerCode: string
  userCode: string
  scopes: Spec.LinkhubIssueTokenApiResponse['scope']
  ipAddress: string
  expiredAt: Spec.PopbillIssueTokenApiResponse['expiration']
}

export interface IssueTokenRequest {
  serviceId: Spec.PopbillIssueTokenApiRequestPath['serviceId']
  accessId: string | null
  scopes: readonly Spec.LinkhubAuthScope[]
  forwardedIp?: string
}

export interface LinkhubAuthClient {
  issueToken(request: IssueTokenRequest, options?: RequestCallOptions): Promise<LinkhubTokenResponse>
}

/** Auth-host point APIs authenticated by an issued service token. */
export interface LinkhubPointClient {
  getBalance(token: LinkhubTokenResponse, options?: RequestCallOptions): Promise<string>
  getPartnerBalance(token: LinkhubTokenResponse, options?: RequestCallOptions): Promise<string>
  getPartnerURL(token: LinkhubTokenResponse, toGo: string, options?: RequestCallOptions): Promise<string>
}

export interface LinkhubAuthClientConfig {
  fetch?: typeof globalThis.fetch
  requestContext?: RequestContext
  /**
   * Linkhub LinkID (required).
   */
  linkId: string
  /**
   * Linkhub SecretKey (required, base64-encoded).
   */
  secretKey: string
  /**
   * Override auth base URL.
   */
  authBaseUrl?: string
  /**
   * Use static outbound auth host.
   * @default false
   */
  useStaticIp?: boolean
  /**
   * Use GA auth host.
   * @default false
   */
  useGaIp?: boolean
  /**
   * Use local UTC time for x-lh-date.
   * @default true
   */
  useLocalTime?: boolean
  /**
   * Request timeout in milliseconds, up to 2_147_483_647.
   * @default 180000
   */
  timeoutMs?: number
}

export interface TokenProvider {
  getToken(businessNumber: string, options?: RequestCallOptions): Promise<LinkhubTokenResponse>
  /** Clear a member's cached token without caching any older in-flight issuance. */
  invalidate?(businessNumber: string): void
}

export interface CachedTokenProvider extends TokenProvider {
  invalidate(businessNumber: string): void
}

export interface CreateTokenProviderInput {
  requestContext?: RequestContext
  authClient: LinkhubAuthClient
  serviceId: Spec.PopbillIssueTokenApiRequestPath['serviceId']
  scopes: readonly Spec.LinkhubAuthScope[]
  forwardedIp?: string
  /**
   * Refresh cached tokens this many milliseconds before expiration.
   * @default 60000
   */
  refreshSkewMs?: number
}

export interface ResolvedLinkhubAuthClientConfig {
  fetch?: typeof globalThis.fetch
  requestContext?: RequestContext
  linkId: string
  secretKey: string
  authBaseUrl?: string
  useStaticIp: boolean
  useGaIp: boolean
  useLocalTime: boolean
  timeoutMs: number
}
