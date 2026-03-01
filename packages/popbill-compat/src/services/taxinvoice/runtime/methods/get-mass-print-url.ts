import { validateMgtKeyList } from '@/internal/validation'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetMassPrintUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKeyList: string[],
  userId: string
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType)

  const mgtKeyListError = validateMgtKeyList(mgtKeyList)
  if (mgtKeyListError) {
    throw mgtKeyListError
  }

  const response = await context.requestClient.requestJson<Spec.TaxInvoiceGetMassPrintUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}?Print`,
    corpNum,
    userId,
    method: 'POST',
    body: JSON.stringify(mgtKeyList),
  })

  return response.url
}
