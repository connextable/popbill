import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { validateCorpNum, validateSubmitId, validateTaxinvoicePayload } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type { ParsedBulkSubmitOptions } from '@/services/taxinvoice/runtime/parsers/bulk-submit'
import type * as Spec from '@connextable/popbill-spec'

export async function requestBulkSubmit(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  submitID: string,
  taxinvoiceList: Spec.TaxInvoiceApiModel[],
  options: ParsedBulkSubmitOptions
): Promise<Spec.TaxInvoiceBulkSubmitApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const submitIdError = validateSubmitId(submitID)
  if (submitIdError) {
    throw submitIdError
  }

  const taxinvoiceListError = validateTaxinvoicePayload(taxinvoiceList)
  if (taxinvoiceListError) {
    throw taxinvoiceListError
  }

  for (const taxinvoice of taxinvoiceList) {
    const taxinvoiceError = validateTaxinvoicePayload(taxinvoice)
    if (taxinvoiceError) {
      throw taxinvoiceError
    }
  }

  const requestBody: {
    invoices: Spec.TaxInvoiceApiModel[]
    forceIssue?: boolean
  } = {
    invoices: taxinvoiceList,
  }

  if (options.forceIssue) {
    requestBody.forceIssue = true
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceBulkSubmitApiResponse>({
    uri: '/Taxinvoice',
    corpNum,
    userId: options.userId,
    method: 'BULKISSUE',
    submitId: submitID,
    body: stringifyWithoutEmptyValues(requestBody),
  })
}
