import type {
  TaxInvoiceGetEPrintUrlApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetEPrintUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const response = await context.requestClient.requestJson<TaxInvoiceGetEPrintUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?TG=EPRINT`,
    corpNum,
    userId,
    method: 'GET',
  })

  return response.url
}
