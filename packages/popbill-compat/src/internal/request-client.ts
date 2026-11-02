import {
  createLinkhubAuthClient,
  createPopbillRequestClient,
  createTokenProvider,
  LinkhubAuthScope,
  PopbillApiBaseUrls,
  PopbillServiceIds,
  type PopbillRequestClient,
  type TokenProvider,
} from '@connextable/popbill-runtime'
import { normalizeOptionalString } from '@connextable/popbill-utils'
import type { CompatConfig } from '@/config'
import type * as Spec from '@connextable/popbill-spec'

const DEFAULT_REQUEST_TIMEOUT_MS = 180_000
const DEFAULT_ACCEPT_ENCODING = 'gzip,deflate'
const tokenProviders = new WeakMap<CompatConfig, Set<WeakRef<TokenProvider>>>()

/** 모든 서비스가 같은 설정 객체를 사용할 때 회원 탈퇴 후 토큰을 함께 폐기합니다. */
export function registerCompatTokenProvider(config: CompatConfig, provider: TokenProvider): void {
  let registered = tokenProviders.get(config)
  if (!registered) {
    registered = new Set()
    tokenProviders.set(config, registered)
  }
  for (const reference of registered) {
    if (reference.deref() === undefined) registered.delete(reference)
  }
  // A retained configuration must not keep discarded service instances alive.
  registered.add(new WeakRef(provider))
}
function invalidateCompatTokens(config: CompatConfig, corpNum: string): void {
  const registered = tokenProviders.get(config)
  if (!registered) return
  for (const reference of registered) {
    const provider = reference.deref()
    if (provider) provider.invalidate?.(corpNum)
    else registered.delete(reference)
  }
}

interface ResolvedCompatRequestConfig {
  isTest: boolean
  useStaticIp: boolean
  useGaIp: boolean
  useLocalTime: boolean
  ipRestrictOnOff: boolean
  acceptEncoding: string | null
  acceptLanguage?: Spec.PopbillAcceptLanguage
  requestTimeoutMs: number
}

export function createTaxinvoiceRequestClient(config: CompatConfig): PopbillRequestClient {
  return createCompatRequestClient(config, [LinkhubAuthScope.Member, LinkhubAuthScope.TaxInvoice])
}

export function createStatementRequestClient(config: CompatConfig): PopbillRequestClient {
  return createCompatRequestClient(config, [
    LinkhubAuthScope.Member,
    LinkhubAuthScope.TradeStatement,
    LinkhubAuthScope.Invoice,
    LinkhubAuthScope.Estimate,
    LinkhubAuthScope.PurchaseOrder,
    LinkhubAuthScope.Deposit,
    LinkhubAuthScope.Receipt,
  ])
}

export function createCompatRequestClient(config: CompatConfig, scopes: readonly Spec.LinkhubAuthScope[]): PopbillRequestClient {
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
    serviceId: resolvedConfig.isTest ? PopbillServiceIds.Test : PopbillServiceIds.Production,
    scopes,
    forwardedIp: resolvedConfig.ipRestrictOnOff ? undefined : '*',
  })

  registerCompatTokenProvider(config, tokenProvider)
  const requestClient = createPopbillRequestClient({
    apiBaseUrl: resolveApiBaseUrl(resolvedConfig),
    timeoutMs: resolvedConfig.requestTimeoutMs,
    tokenProvider,
    acceptEncoding: resolvedConfig.acceptEncoding,
    acceptLanguage: resolvedConfig.acceptLanguage,
  })
  return { ...requestClient, invalidateToken: (corpNum) => invalidateCompatTokens(config, corpNum) }
}

function resolveCompatRequestConfig(config: CompatConfig): ResolvedCompatRequestConfig {
  return {
    isTest: config.IsTest ?? false,
    useStaticIp: config.UseStaticIP ?? false,
    useGaIp: config.UseGAIP ?? false,
    useLocalTime: config.UseLocalTimeYN ?? true,
    ipRestrictOnOff: config.IPRestrictOnOff ?? true,
    acceptEncoding: config.acceptEncoding === undefined ? DEFAULT_ACCEPT_ENCODING : config.acceptEncoding,
    acceptLanguage: normalizeOptionalString(config.acceptLanguage),
    requestTimeoutMs: config.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS,
  }
}

function resolveApiBaseUrl(config: Pick<ResolvedCompatRequestConfig, 'isTest' | 'useGaIp' | 'useStaticIp'>): Spec.PopbillApiBaseUrl {
  if (config.useGaIp) {
    return config.isTest ? PopbillApiBaseUrls.GaTest : PopbillApiBaseUrls.GaProduction
  }

  if (config.useStaticIp) {
    return config.isTest ? PopbillApiBaseUrls.StaticTest : PopbillApiBaseUrls.StaticProduction
  }

  return config.isTest ? PopbillApiBaseUrls.Test : PopbillApiBaseUrls.Production
}
