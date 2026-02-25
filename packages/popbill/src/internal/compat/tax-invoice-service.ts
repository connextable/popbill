import {
  createTaxinvoicePromiseService,
  type CompatConfig,
  type TaxinvoicePromiseService,
} from '@connextable/popbill-compat/factory'
import { normalizeOptionalString } from '@connextable/popbill-core'

const DEFAULT_REQUEST_TIMEOUT_MILLISECONDS = 180_000
const DEFAULT_ACCEPT_ENCODING = 'gzip'

/**
 * TaxInvoice compat service 생성을 위한 입력 설정입니다.
 */
export interface CreateCompatTaxInvoiceServiceInput {
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

/**
 * `@connextable/popbill-compat` Taxinvoice promise 서비스를 client 단위 인스턴스로 생성합니다.
 */
export function createCompatTaxInvoiceService(input: CreateCompatTaxInvoiceServiceInput): TaxinvoicePromiseService {
  const compatConfig: CompatConfig = {
    LinkID: input.linkId,
    SecretKey: input.secretKey,
    IsTest: input.isTest ?? false,
    UseStaticIP: input.useStaticIp ?? false,
    UseGAIP: input.useGaIp ?? false,
    UseLocalTimeYN: input.useLocalTime ?? true,
    IPRestrictOnOff: input.ipRestrictOnOff ?? true,
    requestTimeoutMs: input.requestTimeoutMilliseconds ?? DEFAULT_REQUEST_TIMEOUT_MILLISECONDS,
    acceptLanguage: normalizeOptionalString(input.acceptLanguage),
    acceptEncoding: input.acceptEncoding === undefined ? DEFAULT_ACCEPT_ENCODING : input.acceptEncoding,
  }

  return createTaxinvoicePromiseService(compatConfig)
}
