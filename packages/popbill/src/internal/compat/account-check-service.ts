import { createAccountCheckPromiseService, type AccountCheckPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatAccountCheckServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatAccountCheckService(input: CreateCompatAccountCheckServiceInput): AccountCheckPromiseService {
  return createAccountCheckPromiseService(resolveCompatConfiguration(input))
}
