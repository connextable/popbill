
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetDetailInfo(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string
): Promise<Spec.TaxInvoiceGetDetailInfoApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<Spec.TaxInvoiceGetDetailInfoApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}?Detail`,
    corpNum,
    userId,
    method: 'GET',
  })
}
