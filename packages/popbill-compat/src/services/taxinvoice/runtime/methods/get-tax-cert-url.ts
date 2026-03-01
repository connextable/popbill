import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetTaxCertUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string
): Promise<Spec.TaxInvoiceGetTaxCertUrlApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceGetTaxCertUrlApiResponse>({
    uri: '/Member?TG=CERT',
    corpNum,
    userId,
    method: 'GET',
  })
}
