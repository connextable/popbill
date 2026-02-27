import type { PopbillApiError } from '@/errors'
import type { TaxInvoiceService } from '@/services/tax-invoice/types'

export interface PopbillClientConfig {
  linkId: string
  secretKey: string
  userId: string

  /**
   * 팝빌 테스트 연동 여부입니다.
   */
  isTest?: boolean

  /**
   * 스태틱 IP 사용 여부입니다.
   */
  useStaticIp?: boolean

  /**
   * GA IP 사용 여부입니다.
   */
  useGaIp?: boolean

  /**
   * 로컬 시간 사용 여부입니다.
   */
  useLocalTime?: boolean

  /**
   * IP 제한 사용 여부입니다.
   */
  ipRestrictOnOff?: boolean

  /**
   * 요청 `Accept-Encoding` 헤더 값입니다.
   */
  acceptEncoding?: string | null

  /**
   * 요청 `Accept-Language` 헤더 값입니다.
   */
  acceptLanguage?: string

  /**
   * 요청 타임아웃(ms)입니다.
   */
  requestTimeoutMs?: number

  /**
   * SDK 에러 콜백입니다.
   */
  onError?: (error: PopbillApiError) => void
}

/**
 * Popbill SDK 클라이언트입니다.
 */
export interface PopbillClient {
  services: {
    taxInvoice: TaxInvoiceService
  }
}
