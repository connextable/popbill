import { createMessagePromiseService, type MessagePromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatMessageServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatMessageService(input: CreateCompatMessageServiceInput): MessagePromiseService {
  return createMessagePromiseService(resolveCompatConfiguration(input))
}
