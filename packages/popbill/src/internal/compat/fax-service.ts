import { createFaxPromiseService, type FaxPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatFaxServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatFaxService(input: CreateCompatFaxServiceInput): FaxPromiseService {
  return createFaxPromiseService(resolveCompatConfiguration(input))
}
