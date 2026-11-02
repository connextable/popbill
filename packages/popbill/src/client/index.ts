import type { PopbillClient, PopbillClientConfig } from './types'
export type { PopbillClient, PopbillClientConfig } from './types'
import { createCommonService } from '@/services/common'
import { createTaxInvoiceService } from '@/services/tax-invoice'
import { createCashbillService } from '@/services/cashbill'
import { createStatementService } from '@/services/statement'
import { createHomeTaxTaxInvoiceService } from '@/services/home-tax-tax-invoice'
import { createHomeTaxCashbillService } from '@/services/home-tax-cashbill'
import { createClosedownService } from '@/services/closedown'
import { createBizInfoCheckService } from '@/services/biz-info-check'
import { createEasyFinBankService } from '@/services/easy-fin-bank'
import { createAccountCheckService } from '@/services/account-check'
import { createKakaoService } from '@/services/kakao'
import { createMessageService } from '@/services/message'
import { createFaxService } from '@/services/fax'
import * as bridges from '@/internal/compat'
import type { PopbillApiError } from '@/errors'
import { normalizeOptionalString, normalizeRequiredString } from '@connextable/popbill-utils'

const DEFAULT_REQUEST_TIMEOUT_MILLISECONDS = 180_000
const MAX_REQUEST_TIMEOUT_MILLISECONDS = 2_147_483_647
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
  const serviceInput = { defaultUserId: normalizedConfig.userId, onError: normalizedConfig.onError }

  return {
    services: {
      common: createCommonService({
        ...serviceInput,
        linkId: normalizedConfig.linkId,
        compatCommonService: bridges.createCompatCommonService(normalizedConfig),
      }),
      taxInvoice: createTaxInvoiceService({ ...serviceInput, compatTaxInvoiceService: bridges.createCompatTaxInvoiceService(normalizedConfig) }),
      cashbill: createCashbillService({ ...serviceInput, compatCashbillService: bridges.createCompatCashbillService(normalizedConfig) }),
      statement: createStatementService({ ...serviceInput, compatStatementService: bridges.createCompatStatementService(normalizedConfig) }),
      homeTaxTaxInvoice: createHomeTaxTaxInvoiceService({
        ...serviceInput,
        compatHTTaxinvoiceService: bridges.createCompatHomeTaxTaxInvoiceService(normalizedConfig),
      }),
      homeTaxCashbill: createHomeTaxCashbillService({
        ...serviceInput,
        compatHomeTaxCashbillService: bridges.createCompatHomeTaxCashbillService(normalizedConfig),
      }),
      closedown: createClosedownService({ ...serviceInput, compatClosedownService: bridges.createCompatClosedownService(normalizedConfig) }),
      bizInfoCheck: createBizInfoCheckService({
        ...serviceInput,
        compatBizInfoCheckService: bridges.createCompatBizInfoCheckService(normalizedConfig),
      }),
      easyFinBank: createEasyFinBankService({ ...serviceInput, compatEasyFinBankService: bridges.createCompatEasyFinBankService(normalizedConfig) }),
      accountCheck: createAccountCheckService({
        ...serviceInput,
        compatAccountCheckService: bridges.createCompatAccountCheckService(normalizedConfig),
      }),
      kakao: createKakaoService({ ...serviceInput, compatKakaoService: bridges.createCompatKakaoService(normalizedConfig) }),
      message: createMessageService({ ...serviceInput, compatMessageService: bridges.createCompatMessageService(normalizedConfig) }),
      fax: createFaxService({ ...serviceInput, compatFaxService: bridges.createCompatFaxService(normalizedConfig) }),
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

  if (!Number.isInteger(requestTimeoutMs) || requestTimeoutMs <= 0 || requestTimeoutMs > MAX_REQUEST_TIMEOUT_MILLISECONDS) {
    throw new Error(`requestTimeoutMs는 1 이상 ${MAX_REQUEST_TIMEOUT_MILLISECONDS} 이하의 정수여야 합니다.`)
  }

  return requestTimeoutMs
}
