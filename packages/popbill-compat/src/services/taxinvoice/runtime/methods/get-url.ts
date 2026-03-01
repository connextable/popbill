import { validateGetUrlInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  togo: Spec.TaxInvoiceGetUrlTogo,
  userId: string
): Promise<string> {
  validateGetUrlInputs(corpNum, togo)

  const response = await context.requestClient.requestJson<Spec.TaxInvoiceGetUrlApiResponse>({
    uri: `/Taxinvoice?TG=${togo}`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
