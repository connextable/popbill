import type { TaxInvoiceGetUrlApiResponse, TaxInvoiceGetUrlTogo } from '@connextable/popbill-spec'
import { validateGetUrlInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  togo: TaxInvoiceGetUrlTogo,
  userId: string
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
