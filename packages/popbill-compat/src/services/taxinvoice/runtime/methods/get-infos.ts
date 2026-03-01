import { validateMgtKeyList } from '@/internal/validation'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetInfos(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKeyList: string[],
  userId: string
): Promise<Spec.TaxInvoiceGetInfosApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType)

  const mgtKeyListError = validateMgtKeyList(mgtKeyList)
  if (mgtKeyListError) {
    throw mgtKeyListError
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceGetInfosApiResponse>({
    uri: `/Taxinvoice/${keyType}`,
    corpNum,
    userId,
    method: 'POST',
    body: JSON.stringify(mgtKeyList),
  })
}
