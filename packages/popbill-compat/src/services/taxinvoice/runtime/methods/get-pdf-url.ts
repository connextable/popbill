import type {
  TaxInvoiceGetPdfUrlApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetPdfUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const response = await context.requestClient.requestJson<TaxInvoiceGetPdfUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?TG=PDF`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
