import { createClosedownPromiseService, type ClosedownPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatClosedownServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatClosedownService(input: CreateCompatClosedownServiceInput): ClosedownPromiseService {
  return createClosedownPromiseService(resolveCompatConfiguration(input))
}
