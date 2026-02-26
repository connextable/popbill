import type { PopbillApiError } from '@/errors'
import type { TaxInvoiceService } from '@/services/tax-invoice/types'

export interface PopbillClientConfig {
  linkId: string
  secretKey: string
  /** 모든 요청에 공통 적용할 팝빌 회원 아이디입니다. */
  userId: string
  isTest?: boolean
  useStaticIp?: boolean
  useGaIp?: boolean
  useLocalTime?: boolean
  ipRestrictOnOff?: boolean
  acceptEncoding?: string | null
  acceptLanguage?: string
  requestTimeoutMs?: number
  onError?: (error: PopbillApiError) => void
}

export interface PopbillClient {
  services: {
    taxInvoice: TaxInvoiceService
  }
}
