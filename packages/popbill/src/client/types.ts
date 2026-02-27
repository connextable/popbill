import type { PopbillApiError } from '@/errors'
import type { TaxInvoiceService } from '@/services/tax-invoice/types'

export interface PopbillClientConfig {
  linkId: string
  secretKey: string
  userId: string

  /**
   * 팝빌 테스트 연동 여부입니다.
   *
   * @default false
   */
  isTest?: boolean

  /**
   * 스태틱 IP 사용 여부입니다.
   *
   * @default false
   */
  useStaticIp?: boolean

  /**
   * GA IP 사용 여부입니다.
   *
   * @default false
   */
  useGaIp?: boolean

  /**
   * 로컬 시간 사용 여부입니다.
   *
   * @default true
   */
  useLocalTime?: boolean

  /**
   * IP 제한 사용 여부입니다.
   *
   * @default true
   */
  ipRestrictOnOff?: boolean

  /**
   * 요청 `Accept-Encoding` 헤더 값입니다.
   *
   * @default 'gzip'
   */
  acceptEncoding?: string | null

  /**
   * 요청 `Accept-Language` 헤더 값입니다.
   *
   * @default ko-KR
   */
  acceptLanguage?: string

  /**
   * 요청 타임아웃(ms)입니다.
   *
   * @default 180_000 (3분)
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
