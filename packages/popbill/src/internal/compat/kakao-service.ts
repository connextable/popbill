import { createKakaoPromiseService, type KakaoPromiseService } from '@connextable/popbill-compat/factory'
import { resolveCompatConfiguration } from './config'
import type { CreateCompatTaxInvoiceServiceInput } from './tax-invoice-service'

export type CreateCompatKakaoServiceInput = CreateCompatTaxInvoiceServiceInput

export function createCompatKakaoService(input: CreateCompatKakaoServiceInput): KakaoPromiseService {
  return createKakaoPromiseService(resolveCompatConfiguration(input))
}
