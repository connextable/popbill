import type { PopbillClient, PopbillClientConfig } from './types'
import { createTaxInvoiceService } from '../services/tax-invoice'
import { createLinkhubAuthClient, createTokenProvider, LinkhubAuthScope } from '../internal/linkhub'
import { createPopbillRequestClient } from '../internal/popbill'
import type { PopbillApiError } from '../errors'
import { normalizeOptionalString } from '@/utils/string'

const DEFAULT_REQUEST_TIMEOUT_MS = 180_000
const DEFAULT_ACCEPT_ENCODING = 'gzip'

interface ResolvedPopbillClientConfig {
  linkId: string
  secretKey: string
  isTest: boolean
  useStaticIp: boolean
  useGaIp: boolean
  useLocalTime: boolean
  ipRestrictOnOff: boolean
  acceptEncoding: string | null
  acceptLanguage?: string
  requestTimeoutMs: number
  onError: (error: PopbillApiError) => void
}

function noopErrorHandler(_error: PopbillApiError): void {}

export function createPopbillClient(config: PopbillClientConfig): PopbillClient {
  if (config.linkId.trim().length === 0) {
    throw new Error('linkId는 필수입니다.')
  }

  if (config.secretKey.trim().length === 0) {
    throw new Error('secretKey는 필수입니다.')
  }

  const normalizedConfig: ResolvedPopbillClientConfig = {
    linkId: config.linkId,
    secretKey: config.secretKey,
    isTest: config.isTest ?? false,
    useStaticIp: config.useStaticIp ?? false,
    useGaIp: config.useGaIp ?? false,
    useLocalTime: config.useLocalTime ?? true,
    ipRestrictOnOff: config.ipRestrictOnOff ?? true,
    acceptEncoding: config.acceptEncoding === undefined ? DEFAULT_ACCEPT_ENCODING : config.acceptEncoding,
    acceptLanguage: normalizeOptionalString(config.acceptLanguage),
    requestTimeoutMs: config.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS,
    onError: config.onError ?? noopErrorHandler,
  }

  const authClient = createLinkhubAuthClient({
    linkId: normalizedConfig.linkId,
    secretKey: normalizedConfig.secretKey,
    useStaticIp: normalizedConfig.useStaticIp,
    useGaIp: normalizedConfig.useGaIp,
    useLocalTime: normalizedConfig.useLocalTime,
    timeoutMs: normalizedConfig.requestTimeoutMs,
  })

  const tokenProvider = createTokenProvider({
    authClient,
    serviceId: normalizedConfig.isTest ? 'POPBILL_TEST' : 'POPBILL',
    scopes: [LinkhubAuthScope.Member, LinkhubAuthScope.TaxInvoice],
    forwardedIp: normalizedConfig.ipRestrictOnOff ? undefined : '*',
  })

  const apiBaseUrl = resolveApiBaseUrl(normalizedConfig)
  const requestClient = createPopbillRequestClient({
    apiBaseUrl,
    timeoutMs: normalizedConfig.requestTimeoutMs,
    tokenProvider,
    acceptEncoding: normalizedConfig.acceptEncoding,
    acceptLanguage: normalizedConfig.acceptLanguage,
  })

  const taxInvoiceService = createTaxInvoiceService({
    requestClient,
    defaultErrorHandler: normalizedConfig.onError,
  })

  return {
    services: {
      taxInvoice: taxInvoiceService,
    },
  }
}

function resolveApiBaseUrl(
  config: Pick<ResolvedPopbillClientConfig, 'isTest' | 'useGaIp' | 'useStaticIp'>,
): string {
  if (config.useGaIp) {
    return config.isTest
      ? 'https://ga-popbill-test.linkhub.co.kr'
      : 'https://ga-popbill.linkhub.co.kr'
  }

  if (config.useStaticIp) {
    return config.isTest
      ? 'https://static-popbill-test.linkhub.co.kr'
      : 'https://static-popbill.linkhub.co.kr'
  }

  return config.isTest
    ? 'https://popbill-test.linkhub.co.kr'
    : 'https://popbill.linkhub.co.kr'
}
