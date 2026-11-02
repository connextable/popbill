import { createCommonPromiseService, type CommonPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatCommonServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatCommonService(input: CreateCompatCommonServiceInput): CommonPromiseService {
  return createCommonPromiseService(resolveCompatConfiguration(input))
}
