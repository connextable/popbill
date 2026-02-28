
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetPdfUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const response = await context.requestClient.requestJson<Spec.TaxInvoiceGetPdfUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?TG=PDF`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
