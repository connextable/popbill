import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { validateTaxinvoicePayload } from '@/internal/validation'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestUpdate(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  taxinvoice: Spec.TaxInvoiceApiModel,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const taxinvoiceError = validateTaxinvoicePayload(taxinvoice)
  if (taxinvoiceError) {
    throw taxinvoiceError
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'PATCH',
    body: stringifyWithoutEmptyValues(taxinvoice),
  })
}
