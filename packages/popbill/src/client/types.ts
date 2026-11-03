import type { PopbillApiError } from '@/errors'
import type { CommonService } from '@/services/common/types'
import type { TaxInvoiceService } from '@/services/tax-invoice/types'
import type { CashbillService } from '@/services/cashbill/types'
import type { StatementService } from '@/services/statement/types'
import type { HomeTaxTaxInvoiceService } from '@/services/home-tax-tax-invoice/types'
import type { HomeTaxCashbillService } from '@/services/home-tax-cashbill/types'
import type { ClosedownService } from '@/services/closedown/types'
import type { BizInfoCheckService } from '@/services/biz-info-check/types'
import type { EasyFinBankService } from '@/services/easy-fin-bank/types'
import type { AccountCheckService } from '@/services/account-check/types'
import type { KakaoService } from '@/services/kakao/types'
import type { MessageService } from '@/services/message/types'
import type { FaxService } from '@/services/fax/types'

export interface PopbillClientConfig {
  /** 인증·시간·업무 요청 전체에 사용할 Fetch 호환 전송 함수입니다. */
  fetch?: typeof globalThis.fetch
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
   * 생략하면 해당 헤더를 보내지 않습니다.
   */
  acceptLanguage?: string

  /**
   * 요청 타임아웃(ms)입니다. 1 이상 2147483647 이하의 정수를 사용합니다.
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
    common: CommonService
    taxInvoice: TaxInvoiceService
    cashbill: CashbillService
    statement: StatementService
    homeTaxTaxInvoice: HomeTaxTaxInvoiceService
    homeTaxCashbill: HomeTaxCashbillService
    closedown: ClosedownService
    bizInfoCheck: BizInfoCheckService
    easyFinBank: EasyFinBankService
    accountCheck: AccountCheckService
    kakao: KakaoService
    message: MessageService
    fax: FaxService
  }
}
