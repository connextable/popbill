import type {
  TaxInvoiceGetSendToNTSConfigApiResponse,
} from '@connextable/popbill-spec'
import { validateCorpNum } from '../../../../internal/validation'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestGetSendToNtsConfig(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string,
): Promise<TaxInvoiceGetSendToNTSConfigApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<TaxInvoiceGetSendToNTSConfigApiResponse>({
    uri: '/Taxinvoice/SendToNTSConfig',
    corpNum,
    userId,
    method: 'GET',
  })
}
