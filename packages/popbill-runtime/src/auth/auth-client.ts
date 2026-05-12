import { fetchJson, fetchText } from '../transport/fetch-json'
import { PopbillAuthBaseUrls, PopbillAuthScopes, PopbillLinkhubApiVersion } from '@/spec-constants'
import { hmacSha256Base64, normalizeOptionalString, sha256Base64, stringifyWithoutEmptyValues, trimTrailingSlash } from '@connextable/popbill-utils'
import type * as Spec from '@connextable/popbill-spec'
import type * as Types from './types'

const LINKHUB_VERSION = PopbillLinkhubApiVersion
const LINKHUB_USER_AGENT = 'NODEJS LINKHUB SDK'
const DEFAULT_TIMEOUT_MS = 180_000
const POPBILL_SCOPE_SET = new Set(Object.values(PopbillAuthScopes))

export function createLinkhubAuthClient(config: Types.LinkhubAuthClientConfig): Types.LinkhubAuthClient {
  return {
    async issueToken(request: Types.IssueTokenRequest): Promise<Types.LinkhubTokenResponse> {
      return issueTokenRequest(
        {
          linkId: config.linkId,
          secretKey: config.secretKey,
          authBaseUrl: normalizeAuthBaseUrl(config.authBaseUrl),
          useStaticIp: config.useStaticIp ?? false,
          useGaIp: config.useGaIp ?? false,
          useLocalTime: config.useLocalTime ?? true,
          timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        },
        request
      )
    },
  }
}

function resolveAuthBaseUrl(config: Types.ResolvedLinkhubAuthClientConfig): string {
  if (config.authBaseUrl) {
    return config.authBaseUrl
  }

  const { useStaticIp, useGaIp } = config
  if (useGaIp) return PopbillAuthBaseUrls.Ga
  if (useStaticIp) return PopbillAuthBaseUrls.Static
  return PopbillAuthBaseUrls.Default
}

async function issueTokenRequest(
  config: Types.ResolvedLinkhubAuthClientConfig,
  request: Types.IssueTokenRequest
): Promise<Types.LinkhubTokenResponse> {
  validateIssueTokenRequest(request)

  const authBaseUrl = resolveAuthBaseUrl(config)
  const resourceUri = `/${request.serviceId}/Token`
  const requestBody: Spec.PopbillIssueTokenApiRequestBody = {
    access_id: request.accessId,
    scope: [...request.scopes],
  }
  const body = stringifyWithoutEmptyValues(requestBody)

  const bodyDigest = sha256Base64(body)
  const dateHeader = await resolveDateHeader(config, authBaseUrl)

  const canonicalHeaders = buildCanonicalHeaders(request.forwardedIp)
  const canonicalizedHeaderValues = canonicalizeLinkhubHeaderValues(canonicalHeaders)
  const signaturePayload = buildSignaturePayload('POST', bodyDigest, dateHeader, canonicalizedHeaderValues, resourceUri)
  const signature = hmacSha256Base64(signaturePayload, config.secretKey)

  const requestHeaders: Record<string, string> = {
    Authorization: `LINKHUB ${config.linkId} ${signature}`,
    'Content-Type': 'application/json',
    'User-Agent': LINKHUB_USER_AGENT,
    'x-lh-date': dateHeader,
    'x-lh-version': LINKHUB_VERSION,
  }

  if (request.forwardedIp) {
    requestHeaders['x-lh-forwarded'] = request.forwardedIp
  }

  const rawResponse = await fetchJson<Types.LinkhubTokenApiResponse>(
    `${authBaseUrl}${resourceUri}`,
    {
      method: 'POST',
      headers: requestHeaders,
      body,
    },
    { timeoutMs: config.timeoutMs }
  )

  return mapToLinkhubTokenResponse(rawResponse)
}

async function resolveDateHeader(config: Types.ResolvedLinkhubAuthClientConfig, authBaseUrl: string): Promise<Spec.PopbillUtcDateTimeString> {
  if (config.useLocalTime) {
    return formatUtcDateTime(new Date())
  }

  try {
    const serverTime = await fetchText(`${authBaseUrl}/Time`, { method: 'GET' }, { timeoutMs: config.timeoutMs })
    const normalizedServerTime = normalizeUtcDateTime(serverTime)
    if (normalizedServerTime) {
      return normalizedServerTime
    }
  } catch {
    // Fallback to local UTC timestamp when server time API is not reachable.
  }

  return formatUtcDateTime(new Date())
}

function buildCanonicalHeaders(forwardedIp: string | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    'x-lh-version': LINKHUB_VERSION,
  }

  if (forwardedIp) {
    headers['x-lh-forwarded'] = forwardedIp
  }

  return headers
}

function canonicalizeLinkhubHeaderValues(headers: Record<string, string>): string {
  const normalizedEntries: [string, string][] = []

  for (const [name, value] of Object.entries(headers)) {
    normalizedEntries.push([name.toLowerCase().trim(), value.trim()])
  }

  normalizedEntries.sort((a, b) => a[0].localeCompare(b[0]))

  const mergedValues = new Map<string, string[]>()

  for (const [key, value] of normalizedEntries) {
    const existing = mergedValues.get(key)
    if (existing) {
      existing.push(value)
      continue
    }
    mergedValues.set(key, [value])
  }

  const canonicalValues: string[] = []

  for (const key of [...mergedValues.keys()].sort()) {
    const values = mergedValues.get(key) ?? []
    canonicalValues.push(values.join(','))
  }

  return canonicalValues.join('\n')
}

function buildSignaturePayload(
  method: string,
  contentMd5: string,
  dateHeader: string,
  canonicalizedHeaderValues: string,
  resourceUri: string
): string {
  if (canonicalizedHeaderValues.length === 0) {
    return `${method}\n${contentMd5}\n${dateHeader}\n${resourceUri}`
  }

  return `${method}\n${contentMd5}\n${dateHeader}\n${canonicalizedHeaderValues}\n${resourceUri}`
}

function mapToLinkhubTokenResponse(response: Types.LinkhubTokenApiResponse): Types.LinkhubTokenResponse {
  return {
    sessionToken: response.session_token,
    serviceId: response.serviceID,
    linkId: response.linkID,
    userId: response.userID,
    partnerCode: response.partnerCode,
    userCode: response.usercode,
    scopes: response.scope,
    ipAddress: response.ipaddress,
    expiredAt: response.expiration,
  }
}

function validateIssueTokenRequest(request: Types.IssueTokenRequest): void {
  if (request.serviceId.trim().length === 0) {
    throw new Error('Linkhub serviceId is required.')
  }

  if (request.scopes.length === 0) {
    throw new Error('At least one Linkhub auth scope is required.')
  }

  for (const scope of request.scopes) {
    if (!POPBILL_SCOPE_SET.has(scope)) {
      throw new Error(`Unsupported Linkhub auth scope: ${scope}`)
    }
  }
}

function formatUtcDateTime(date: Date): Spec.PopbillUtcDateTimeString {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z') as Spec.PopbillUtcDateTimeString
}

function normalizeUtcDateTime(value: string): Spec.PopbillUtcDateTimeString | undefined {
  const trimmed = value.trim()
  const parsedMilliseconds = Date.parse(trimmed)
  if (Number.isNaN(parsedMilliseconds)) {
    return undefined
  }

  return formatUtcDateTime(new Date(parsedMilliseconds))
}

function normalizeAuthBaseUrl(value: string | undefined): string | undefined {
  const normalized = normalizeOptionalString(value)
  if (!normalized) {
    return undefined
  }

  return trimTrailingSlash(normalized)
}
