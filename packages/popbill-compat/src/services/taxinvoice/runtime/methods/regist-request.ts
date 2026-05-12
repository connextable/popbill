import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { validateTaxinvoicePayload, validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRegistRequest(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  taxinvoice: Spec.TaxInvoiceApiModel,
  memo: string,
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

  const requestBody: Spec.TaxInvoiceApiModel & { memo?: string } = {
    ...taxinvoice,
  }

  if (memo) {
    requestBody.memo = memo
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: '/Taxinvoice',
    corpNum,
    userId,
    method: 'REQUEST',
    body: stringifyWithoutEmptyValues(requestBody),
  })
}
