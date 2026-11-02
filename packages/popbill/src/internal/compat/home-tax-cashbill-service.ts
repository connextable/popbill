import { createHTCashbillPromiseService, type HTCashbillPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatHomeTaxCashbillServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatHomeTaxCashbillService(input: CreateCompatHomeTaxCashbillServiceInput): HTCashbillPromiseService {
  return createHTCashbillPromiseService(resolveCompatConfiguration(input))
}
