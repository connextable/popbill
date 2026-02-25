import type {
  TaxInvoiceGetTaxCertUrlApiResponse,
} from '@connextable/popbill-spec'
import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetTaxCertUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string,
): Promise<TaxInvoiceGetTaxCertUrlApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<TaxInvoiceGetTaxCertUrlApiResponse>({
    uri: '/Member?TG=CERT',
    corpNum,
    userId,
    method: 'GET',
  })
}
