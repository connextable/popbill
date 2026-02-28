import type * as Spec from '@connextable/popbill-spec'


export type LinkhubTokenApiResponse = Spec.PopbillIssueTokenApiResponse

export interface LinkhubTokenResponse {
  sessionToken: string
  serviceId: Spec.PopbillServiceId
  linkId: string
  userId: string
  partnerCode: string
  userCode: string
  scopes: Spec.PopbillAuthScope[]
  ipAddress: string
  expiredAt: Spec.PopbillUtcDateTimeString
}

export interface IssueTokenRequest {
  serviceId: Spec.PopbillServiceId
  accessId: string
  scopes: readonly Spec.PopbillAuthScope[]
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
  serviceId: Spec.PopbillServiceId
  scopes: readonly Spec.PopbillAuthScope[]
  forwardedIp?: string
}

export interface ResolvedLinkhubAuthClientConfig {
  linkId: string
  secretKey: string
  useStaticIp: boolean
  useGaIp: boolean
  useLocalTime: boolean
  timeoutMs: number
}
