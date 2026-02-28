import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { validateRequiredTaxinvoiceInputs, validateTaxinvoiceKeyTypeAllowed } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRequest(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  memo: string,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  validateTaxinvoiceKeyTypeAllowed(keyType, ['BUY'])

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'REQUEST',
    body: stringifyWithoutEmptyValues({ memo }),
  })
}
