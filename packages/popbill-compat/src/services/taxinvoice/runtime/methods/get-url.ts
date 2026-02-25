import type {
  TaxInvoiceGetUrlApiResponse,
  TaxInvoiceGetUrlTogo,
} from '@connextable/popbill-spec'
import { validateGetUrlInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestGetUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  togo: TaxInvoiceGetUrlTogo,
  userId: string,
): Promise<string> {
  validateGetUrlInputs(corpNum, togo)

  const response = await context.requestClient.requestJson<TaxInvoiceGetUrlApiResponse>({
    uri: `/Taxinvoice?TG=${togo}`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
