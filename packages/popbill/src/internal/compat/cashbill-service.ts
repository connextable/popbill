import { createCashbillPromiseService, type CashbillPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatCashbillServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatCashbillService(input: CreateCompatCashbillServiceInput): CashbillPromiseService {
  return createCashbillPromiseService(resolveCompatConfiguration(input))
}
