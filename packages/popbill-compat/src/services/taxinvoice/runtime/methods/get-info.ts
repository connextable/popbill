import type {
  TaxInvoiceGetInfoApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetInfo(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<TaxInvoiceGetInfoApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<TaxInvoiceGetInfoApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'GET',
  })
}
