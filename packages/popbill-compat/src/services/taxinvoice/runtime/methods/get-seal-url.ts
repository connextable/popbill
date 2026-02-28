
import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetSealUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string
): Promise<Spec.TaxInvoiceGetSealUrlApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceGetSealUrlApiResponse>({
    uri: '/Member?TG=SEAL',
    corpNum,
    userId,
    method: 'GET',
  })
}
