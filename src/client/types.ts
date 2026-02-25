import type { PopbillApiError } from '@/errors'
import type { TaxInvoiceService } from '@/services/tax-invoice/type'

export interface PopbillClientConfig {
  linkId: string
  secretKey: string
  isTest?: boolean
  useStaticIp?: boolean
  useGaIp?: boolean
  useLocalTime?: boolean
  ipRestrictOnOff?: boolean
  requestTimeoutMs?: number
  onError?: (error: PopbillApiError) => void
}

export interface PopbillClient {
  services: {
    taxInvoice: TaxInvoiceService
  }
}
