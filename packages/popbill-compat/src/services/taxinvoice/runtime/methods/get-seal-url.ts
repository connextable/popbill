import type {
  TaxInvoiceGetSealUrlApiResponse,
} from '@connextable/popbill-spec'
import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetSealUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string,
): Promise<TaxInvoiceGetSealUrlApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<TaxInvoiceGetSealUrlApiResponse>({
    uri: '/Member?TG=SEAL',
    corpNum,
    userId,
    method: 'GET',
  })
}
