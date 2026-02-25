import type {
  TaxInvoiceGetDetailInfoApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestGetDetailInfo(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<TaxInvoiceGetDetailInfoApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<TaxInvoiceGetDetailInfoApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?Detail`,
    corpNum,
    userId,
    method: 'GET',
  })
}
