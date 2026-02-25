import type {
  TaxInvoiceGetMailUrlApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestGetMailUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const response = await context.requestClient.requestJson<TaxInvoiceGetMailUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?TG=MAIL`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
