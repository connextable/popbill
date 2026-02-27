import { fetchJson, fetchText } from '../http/fetch-json'
import { hmacSha256Base64, sha256Base64, stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import {
  PopbillAuthBaseUrls,
  PopbillAuthScopes,
  PopbillLinkhubApiVersion,
  PopbillServiceIds,
  type PopbillAuthBaseUrl,
  type PopbillIssueTokenApiRequestBody,
  type PopbillUtcDateTimeString,
} from '@connextable/popbill-spec'
import type {
  IssueTokenRequest,
  LinkhubAuthClient,
  LinkhubAuthClientConfig,
  LinkhubTokenApiResponse,
  LinkhubTokenResponse,
  ResolvedLinkhubAuthClientConfig,
} from './types'

const LINKHUB_VERSION = PopbillLinkhubApiVersion
const LINKHUB_USER_AGENT = 'NODEJS LINKHUB SDK'
const DEFAULT_TIMEOUT_MS = 180_000
const POPBILL_SERVICE_ID_SET = new Set([PopbillServiceIds.Test, PopbillServiceIds.Production])
const POPBILL_SCOPE_SET = new Set(Object.values(PopbillAuthScopes))

export function createLinkhubAuthClient(config: LinkhubAuthClientConfig): LinkhubAuthClient {
  return {
    async issueToken(request: IssueTokenRequest): Promise<LinkhubTokenResponse> {
      return issueTokenRequest(
        {
          linkId: config.linkId,
          secretKey: config.secretKey,
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

function resolveAuthBaseUrl(useStaticIp: boolean, useGaIp: boolean): PopbillAuthBaseUrl {
  if (useGaIp) return PopbillAuthBaseUrls.Ga
  if (useStaticIp) return PopbillAuthBaseUrls.Static
  return PopbillAuthBaseUrls.Default
}

async function issueTokenRequest(
  config: ResolvedLinkhubAuthClientConfig,
  request: IssueTokenRequest
): Promise<LinkhubTokenResponse> {
  validateIssueTokenRequest(request)

  const authBaseUrl = resolveAuthBaseUrl(config.useStaticIp, config.useGaIp)
  const resourceUri = `/${request.serviceId}/Token`
  const requestBody: PopbillIssueTokenApiRequestBody = {
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

  const rawResponse = await fetchJson<LinkhubTokenApiResponse>(
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

async function resolveDateHeader(
  config: ResolvedLinkhubAuthClientConfig,
  authBaseUrl: PopbillAuthBaseUrl
): Promise<PopbillUtcDateTimeString> {
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

function mapToLinkhubTokenResponse(response: LinkhubTokenApiResponse): LinkhubTokenResponse {
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

function validateIssueTokenRequest(request: IssueTokenRequest): void {
  if (!POPBILL_SERVICE_ID_SET.has(request.serviceId)) {
    throw new Error(`Unsupported Popbill serviceId: ${request.serviceId}`)
  }

  if (request.scopes.length === 0) {
    throw new Error('At least one Popbill auth scope is required.')
  }

  for (const scope of request.scopes) {
    if (!POPBILL_SCOPE_SET.has(scope)) {
      throw new Error(`Unsupported Popbill auth scope: ${scope}`)
    }
  }
}

function formatUtcDateTime(date: Date): PopbillUtcDateTimeString {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z') as PopbillUtcDateTimeString
}

function normalizeUtcDateTime(value: string): PopbillUtcDateTimeString | undefined {
  const trimmed = value.trim()
  const parsedMilliseconds = Date.parse(trimmed)
  if (Number.isNaN(parsedMilliseconds)) {
    return undefined
  }

  return formatUtcDateTime(new Date(parsedMilliseconds))
}
