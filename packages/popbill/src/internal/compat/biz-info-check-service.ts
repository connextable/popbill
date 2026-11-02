import { createBizInfoCheckPromiseService, type BizInfoCheckPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatBizInfoCheckServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatBizInfoCheckService(input: CreateCompatBizInfoCheckServiceInput): BizInfoCheckPromiseService {
  return createBizInfoCheckPromiseService(resolveCompatConfiguration(input))
}
