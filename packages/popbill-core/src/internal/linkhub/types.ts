import type { LinkhubAuthScope } from './enums'

export interface LinkhubTokenApiResponse {
  session_token: string
  serviceID: 'POPBILL_TEST' | 'POPBILL'
  linkID: string
  userID: string
  partnerCode: string
  usercode: string
  scope: LinkhubAuthScope[]
  ipaddress: string
  expiration: string
}

export interface LinkhubTokenResponse {
  sessionToken: string
  serviceId: 'POPBILL_TEST' | 'POPBILL'
  linkId: string
  userId: string
  partnerCode: string
  userCode: string
  scopes: LinkhubAuthScope[]
  ipAddress: string
  expiredAt: string
}

export interface IssueTokenRequest {
  serviceId: string
  accessId: string
  scopes: readonly LinkhubAuthScope[]
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
  serviceId: string
  scopes: readonly LinkhubAuthScope[]
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
