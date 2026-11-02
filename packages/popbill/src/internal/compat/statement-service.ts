import { createStatementPromiseService, type StatementPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatStatementServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatStatementService(input: CreateCompatStatementServiceInput): StatementPromiseService {
  return createStatementPromiseService(resolveCompatConfiguration(input))
}
