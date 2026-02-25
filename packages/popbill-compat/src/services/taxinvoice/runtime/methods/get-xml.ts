import type {
  TaxInvoiceGetXmlApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestGetXml(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
): Promise<TaxInvoiceGetXmlApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<TaxInvoiceGetXmlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?XML`,
    corpNum,
    userId,
    method: 'GET',
  })
}
