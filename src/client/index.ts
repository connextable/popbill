import type { PopbillClient, PopbillClientConfig } from './types'
import { createTaxInvoiceService } from '../services/tax-invoice'
import { createLinkhubAuthClient, createTokenProvider, LinkhubAuthScope } from '../internal/linkhub'

const DEFAULT_REQUEST_TIMEOUT_MS = 180_000

function noopErrorHandler(): void {}

export function createPopbillClient(config: PopbillClientConfig): PopbillClient {
  if (config.linkId.trim().length === 0) {
    throw new Error('linkId는 필수입니다.')
  }

  if (config.secretKey.trim().length === 0) {
    throw new Error('secretKey는 필수입니다.')
  }

  const normalizedConfig = {
    linkId: config.linkId,
    secretKey: config.secretKey,
    isTest: config.isTest ?? false,
    useStaticIp: config.useStaticIp ?? false,
    useGaIp: config.useGaIp ?? false,
    useLocalTime: config.useLocalTime ?? true,
    ipRestrictOnOff: config.ipRestrictOnOff ?? true,
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
  const taxInvoiceService = createTaxInvoiceService({
    apiBaseUrl,
    timeoutMs: normalizedConfig.requestTimeoutMs,
    tokenProvider,
    defaultErrorHandler: normalizedConfig.onError,
  })

  return {
    services: {
      taxInvoice: taxInvoiceService,
    },
  }
}

function resolveApiBaseUrl(config: Required<PopbillClientConfig>): string {
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
