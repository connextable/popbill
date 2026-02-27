import { createLinkhubAuthClient, createTokenProvider, LinkhubAuthScope } from '@/internal/linkhub'
import { createPopbillRequestClient, type PopbillRequestClient } from '@/internal/popbill'
import type { CompatConfig } from '@/config'

const DEFAULT_REQUEST_TIMEOUT_MS = 180_000
const DEFAULT_ACCEPT_ENCODING = 'gzip,deflate'

interface ResolvedCompatRequestConfig {
  isTest: boolean
  useStaticIp: boolean
  useGaIp: boolean
  useLocalTime: boolean
  ipRestrictOnOff: boolean
  requestTimeoutMs: number
  acceptEncoding: string | null
  acceptLanguage?: string
}

export function createTaxinvoiceRequestClient(config: CompatConfig): PopbillRequestClient {
  const resolvedConfig = resolveCompatRequestConfig(config)

  const authClient = createLinkhubAuthClient({
    linkId: config.LinkID,
    secretKey: config.SecretKey,
    useStaticIp: resolvedConfig.useStaticIp,
    useGaIp: resolvedConfig.useGaIp,
    useLocalTime: resolvedConfig.useLocalTime,
    timeoutMs: resolvedConfig.requestTimeoutMs,
  })

  const tokenProvider = createTokenProvider({
    authClient,
    serviceId: resolvedConfig.isTest ? 'POPBILL_TEST' : 'POPBILL',
    scopes: [LinkhubAuthScope.Member, LinkhubAuthScope.TaxInvoice],
    forwardedIp: resolvedConfig.ipRestrictOnOff ? undefined : '*',
  })

  return createPopbillRequestClient({
    apiBaseUrl: resolveApiBaseUrl(resolvedConfig),
    timeoutMs: resolvedConfig.requestTimeoutMs,
    tokenProvider,
    acceptEncoding: resolvedConfig.acceptEncoding,
    acceptLanguage: resolvedConfig.acceptLanguage,
  })
}

function resolveCompatRequestConfig(config: CompatConfig): ResolvedCompatRequestConfig {
  return {
    isTest: config.IsTest ?? false,
    useStaticIp: config.UseStaticIP ?? false,
    useGaIp: config.UseGAIP ?? false,
    useLocalTime: config.UseLocalTimeYN ?? true,
    ipRestrictOnOff: config.IPRestrictOnOff ?? true,
    requestTimeoutMs: config.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS,
    acceptEncoding: config.acceptEncoding === undefined ? DEFAULT_ACCEPT_ENCODING : config.acceptEncoding,
    acceptLanguage: typeof config.acceptLanguage === 'string' ? config.acceptLanguage : undefined,
  }
}

function resolveApiBaseUrl(config: Pick<ResolvedCompatRequestConfig, 'isTest' | 'useGaIp' | 'useStaticIp'>): string {
  if (config.useGaIp) {
    return config.isTest ? 'https://ga-popbill-test.linkhub.co.kr' : 'https://ga-popbill.linkhub.co.kr'
  }

  if (config.useStaticIp) {
    return config.isTest ? 'https://static-popbill-test.linkhub.co.kr' : 'https://static-popbill.linkhub.co.kr'
  }

  return config.isTest ? 'https://popbill-test.linkhub.co.kr' : 'https://popbill.linkhub.co.kr'
}
