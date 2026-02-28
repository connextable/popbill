
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestCheckMgtKeyInUse(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string
): Promise<boolean> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const response = await context.requestClient.requestJson<Spec.TaxInvoiceCheckMgtKeyInUseApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'GET',
  })

  return typeof response.itemKey === 'string' && response.itemKey.length > 0
}
