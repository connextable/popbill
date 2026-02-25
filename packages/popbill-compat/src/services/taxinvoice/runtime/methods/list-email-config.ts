import type {
  TaxInvoiceListEmailConfigApiResponse,
} from '@connextable/popbill-spec'
import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestListEmailConfig(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string,
): Promise<TaxInvoiceListEmailConfigApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<TaxInvoiceListEmailConfigApiResponse>({
    uri: '/Taxinvoice/EmailSendConfig',
    corpNum,
    userId,
    method: 'GET',
  })
}
