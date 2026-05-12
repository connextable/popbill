export interface JusoRuntimeConfig {
  linkId: string
  secretKey: string
  accessId: string
  apiBaseUrl?: string
  authBaseUrl?: string
  useLocalTime: boolean
  requestTimeoutMilliseconds: number
  acceptLanguage?: string
  forwardedIpAddress?: string
  defaultSearchKeyword?: string
  missingNames: readonly string[]
}
