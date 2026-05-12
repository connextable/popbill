import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { validateCorpNum, validateTaxinvoicePayload } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRegister(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  taxinvoice: Spec.TaxInvoiceApiModel,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const taxinvoiceError = validateTaxinvoicePayload(taxinvoice)
  if (taxinvoiceError) {
    throw taxinvoiceError
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: '/Taxinvoice',
    corpNum,
    userId,
    method: 'POST',
    body: stringifyWithoutEmptyValues(taxinvoice),
  })
}
