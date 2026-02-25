import type {
  TaxInvoiceGetViewUrlApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetViewUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const response = await context.requestClient.requestJson<TaxInvoiceGetViewUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?TG=VIEW`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
