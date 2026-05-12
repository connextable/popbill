import { encodePathSegment, validateRequiredTaxinvoiceInputs, validateTaxinvoiceKeyTypeAllowed } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSendToNts(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  validateTaxinvoiceKeyTypeAllowed(keyType, ['SELL', 'TRUSTEE'])

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${encodePathSegment(mgtKey)}`,
    corpNum,
    userId,
    method: 'NTS',
  })
}
