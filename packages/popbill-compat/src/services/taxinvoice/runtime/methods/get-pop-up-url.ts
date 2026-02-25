import type {
  TaxInvoiceGetPopUpUrlApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestGetPopUpUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const response = await context.requestClient.requestJson<TaxInvoiceGetPopUpUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?TG=POPUP`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
