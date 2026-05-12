import type * as Spec from '@connextable/popbill-spec'

export type LinkhubTokenApiResponse = Spec.PopbillIssueTokenApiResponse

export interface LinkhubTokenResponse {
  sessionToken: string
  serviceId: Spec.PopbillIssueTokenApiResponse['serviceID']
  linkId: string
  userId: string
  partnerCode: string
  userCode: string
  scopes: Spec.PopbillIssueTokenApiResponse['scope']
  ipAddress: string
  expiredAt: Spec.PopbillIssueTokenApiResponse['expiration']
}

export interface IssueTokenRequest {
  serviceId: Spec.PopbillIssueTokenApiRequestPath['serviceId']
  accessId: string
  scopes: readonly Spec.PopbillIssueTokenApiRequestBody['scope'][number][]
  forwardedIp?: string
}

export interface LinkhubAuthClient {
  issueToken(request: IssueTokenRequest): Promise<LinkhubTokenResponse>
}

export interface LinkhubAuthClientConfig {
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
   * Request timeout in milliseconds.
   * @default 180000
   */
  timeoutMs?: number
}

export interface TokenProvider {
  getToken(businessNumber: string): Promise<LinkhubTokenResponse>
}

export interface CreateTokenProviderInput {
  authClient: LinkhubAuthClient
  serviceId: Spec.PopbillIssueTokenApiRequestPath['serviceId']
  scopes: readonly Spec.PopbillIssueTokenApiRequestBody['scope'][number][]
  forwardedIp?: string
  /**
   * Refresh cached tokens this many milliseconds before expiration.
   * @default 60000
   */
  refreshSkewMs?: number
}

export interface ResolvedLinkhubAuthClientConfig {
  linkId: string
  secretKey: string
  authBaseUrl?: string
  useStaticIp: boolean
  useGaIp: boolean
  useLocalTime: boolean
  timeoutMs: number
}
