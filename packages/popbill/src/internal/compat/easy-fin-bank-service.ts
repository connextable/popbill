import { createEasyFinBankPromiseService, type EasyFinBankPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatEasyFinBankServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatEasyFinBankService(input: CreateCompatEasyFinBankServiceInput): EasyFinBankPromiseService {
  return createEasyFinBankPromiseService(resolveCompatConfiguration(input))
}
