import { createTaxinvoicePromiseService, type TaxinvoicePromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration, type CreateCompatServiceInput } from './config'

export type CreateCompatTaxInvoiceServiceInput = CreateCompatServiceInput

export function createCompatTaxInvoiceService(input: CreateCompatTaxInvoiceServiceInput): TaxinvoicePromiseService {
  return createTaxinvoicePromiseService(resolveCompatConfiguration(input))
}
