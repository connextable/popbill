import type { PopbillClient, PopbillClientConfig } from './types'
import { createTaxInvoiceService } from '@/services/tax-invoice'
import { createCompatTaxInvoiceService } from '@/internal/compat'
import type { PopbillApiError } from '@/errors'
import { normalizeOptionalString, normalizeRequiredString } from '@connextable/popbill-utils'

const DEFAULT_REQUEST_TIMEOUT_MILLISECONDS = 180_000
const DEFAULT_ACCEPT_ENCODING = 'gzip'

interface ResolvedPopbillClientConfig {
  linkId: string
  secretKey: string
  userId: string
  isTest: boolean
  useStaticIp: boolean
  useGaIp: boolean
  useLocalTime: boolean
  ipRestrictOnOff: boolean
  acceptEncoding: string | null
  acceptLanguage?: string
  requestTimeoutMilliseconds: number
  onError?: (error: PopbillApiError) => void
}

/**
 * modern Popbill client를 생성합니다.
 */
export function createPopbillClient(config: PopbillClientConfig): PopbillClient {
  const normalizedConfig = normalizeClientConfiguration(config)
  const compatTaxInvoiceService = createCompatTaxInvoiceService(normalizedConfig)

  const taxInvoiceService = createTaxInvoiceService({
    compatTaxInvoiceService,
    defaultUserId: normalizedConfig.userId,
    onError: normalizedConfig.onError,
  })

  return {
    services: {
      taxInvoice: taxInvoiceService,
    },
  }
}

/**
 * 입력 설정을 런타임 안전성 기준으로 정규화합니다.
 */
function normalizeClientConfiguration(config: PopbillClientConfig): ResolvedPopbillClientConfig {
  const linkId = normalizeRequiredString(config.linkId, 'linkId는 필수입니다.')
  const secretKey = normalizeRequiredString(config.secretKey, 'secretKey는 필수입니다.')
  const userId = normalizeRequiredString(config.userId, 'userId는 필수입니다.')

  return {
    linkId,
    secretKey,
    userId,
    isTest: config.isTest ?? false,
    useStaticIp: config.useStaticIp ?? false,
    useGaIp: config.useGaIp ?? false,
    useLocalTime: config.useLocalTime ?? true,
    ipRestrictOnOff: config.ipRestrictOnOff ?? true,
    acceptEncoding: config.acceptEncoding === undefined ? DEFAULT_ACCEPT_ENCODING : config.acceptEncoding,
    acceptLanguage: normalizeOptionalString(config.acceptLanguage),
    requestTimeoutMilliseconds: normalizeRequestTimeoutMilliseconds(config.requestTimeoutMs),
    onError: config.onError,
  }
}

function normalizeRequestTimeoutMilliseconds(requestTimeoutMs: number | undefined): number {
  if (requestTimeoutMs === undefined) {
    return DEFAULT_REQUEST_TIMEOUT_MILLISECONDS
  }

  if (!Number.isInteger(requestTimeoutMs) || requestTimeoutMs <= 0) {
    throw new Error('requestTimeoutMs는 1 이상의 정수여야 합니다.')
  }

  return requestTimeoutMs
}
