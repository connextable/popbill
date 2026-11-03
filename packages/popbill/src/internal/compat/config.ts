import type { CompatConfig } from '@connextable/popbill-compat/factory'
import { normalizeOptionalString } from '@connextable/popbill-utils'
import type { RequestContext } from '@connextable/popbill-runtime'

export interface CreateCompatServiceInput {
  fetch?: typeof globalThis.fetch
  requestContext?: RequestContext
  linkId: string
  secretKey: string
  isTest?: boolean
  useStaticIp?: boolean
  useGaIp?: boolean
  useLocalTime?: boolean
  ipRestrictOnOff?: boolean
  requestTimeoutMilliseconds?: number
  acceptLanguage?: string
  acceptEncoding?: string | null
}
const configurations = new WeakMap<CreateCompatServiceInput, CompatConfig>()

/** client 내부의 모든 서비스는 토큰 폐기 범위를 공유하고 다른 client와는 격리합니다. */
export function resolveCompatConfiguration(input: CreateCompatServiceInput): CompatConfig {
  const cached = configurations.get(input)
  if (cached) return cached
  const resolved: CompatConfig = {
    fetch: input.fetch,
    requestContext: input.requestContext,
    LinkID: input.linkId,
    SecretKey: input.secretKey,
    IsTest: input.isTest ?? false,
    UseStaticIP: input.useStaticIp ?? false,
    UseGAIP: input.useGaIp ?? false,
    UseLocalTimeYN: input.useLocalTime ?? true,
    IPRestrictOnOff: input.ipRestrictOnOff ?? true,
    requestTimeoutMs: input.requestTimeoutMilliseconds ?? 180_000,
    acceptLanguage: normalizeOptionalString(input.acceptLanguage),
    acceptEncoding: input.acceptEncoding === undefined ? 'gzip' : input.acceptEncoding,
  }
  configurations.set(input, resolved)
  return resolved
}
