import { createHTTaxinvoicePromiseService, type HTTaxinvoicePromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatHomeTaxTaxInvoiceServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatHomeTaxTaxInvoiceService(input: CreateCompatHomeTaxTaxInvoiceServiceInput): HTTaxinvoicePromiseService {
  return createHTTaxinvoicePromiseService(resolveCompatConfiguration(input))
}
