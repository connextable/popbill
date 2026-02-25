import type { TaxInvoiceService } from './type'
import type { PopbillApiError } from '@/errors'
import { createGetTaxInvoiceInfo } from './api/get-info'
import type { PopbillRequestClient } from '@/internal/popbill'

export interface CreateTaxInvoiceServiceInput {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: PopbillApiError) => void
}

export function createTaxInvoiceService(input: CreateTaxInvoiceServiceInput): TaxInvoiceService {
  return {
    getInfo: createGetTaxInvoiceInfo({
      requestClient: input.requestClient,
      defaultErrorHandler: input.defaultErrorHandler,
    }),
  }
}
