import type {
  TaxInvoiceGetPrintUrlApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestGetPrintUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const response = await context.requestClient.requestJson<TaxInvoiceGetPrintUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?TG=PRINT`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
