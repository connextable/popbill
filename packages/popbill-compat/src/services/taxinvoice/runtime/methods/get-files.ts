
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetFiles(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string
): Promise<Spec.TaxInvoiceGetFilesApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<Spec.TaxInvoiceGetFilesApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}/Files`,
    corpNum,
    userId,
    method: 'GET',
  })
}
