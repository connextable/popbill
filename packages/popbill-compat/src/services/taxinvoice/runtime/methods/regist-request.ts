import { stringifyWithoutEmptyValues } from '@connextable/popbill-core'
import type { TaxInvoiceApiModel, TaxInvoiceApiResponseBase } from '@connextable/popbill-spec'
import { validateTaxinvoicePayload } from '@/internal/validation'
import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestRegistRequest(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  taxinvoice: TaxInvoiceApiModel,
  memo: string,
  userId: string
): Promise<TaxInvoiceApiResponseBase> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const taxinvoiceError = validateTaxinvoicePayload(taxinvoice)
  if (taxinvoiceError) {
    throw taxinvoiceError
  }

  const requestBody: TaxInvoiceApiModel & { memo?: string } = {
    ...taxinvoice,
  }

  if (memo) {
    requestBody.memo = memo
  }

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: '/Taxinvoice',
    corpNum,
    userId,
    method: 'REQUEST',
    body: stringifyWithoutEmptyValues(requestBody),
  })
}
