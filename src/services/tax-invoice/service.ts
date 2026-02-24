import type { TokenProvider } from '@/internal/linkhub'
import type { TaxInvoiceService } from './type'
import type { PopbillApiError } from '@/client/types'
import { createGetTaxInvoiceInfo } from './api/get-info'

export interface CreateTaxInvoiceServiceInput {
  apiBaseUrl: string
  timeoutMs: number
  tokenProvider: TokenProvider
  defaultErrorHandler?: (error: PopbillApiError) => void
}

export function createTaxInvoiceService(input: CreateTaxInvoiceServiceInput): TaxInvoiceService {
  return {
    getInfo: createGetTaxInvoiceInfo({
      apiBaseUrl: input.apiBaseUrl,
      timeoutMs: input.timeoutMs,
      tokenProvider: input.tokenProvider,
      defaultErrorHandler: input.defaultErrorHandler,
    }),
  }
}
