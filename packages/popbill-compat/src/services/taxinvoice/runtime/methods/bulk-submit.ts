import { stringifyWithoutEmptyValues } from '@connextable/popbill-core'
import type {
  TaxInvoiceApiModel,
  TaxInvoiceBulkSubmitApiResponse,
} from '@connextable/popbill-spec'
import {
  validateCorpNum,
  validateSubmitId,
  validateTaxinvoicePayload,
} from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type { ParsedBulkSubmitOptions } from '@/services/taxinvoice/runtime/parsers/bulk-submit'

export async function requestBulkSubmit(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  submitID: string,
  taxinvoiceList: TaxInvoiceApiModel[],
  options: ParsedBulkSubmitOptions,
): Promise<TaxInvoiceBulkSubmitApiResponse> {
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
    invoices: TaxInvoiceApiModel[]
    forceIssue?: boolean
  } = {
    invoices: taxinvoiceList,
  }

  if (options.forceIssue) {
    requestBody.forceIssue = true
  }

  return context.requestClient.requestJson<TaxInvoiceBulkSubmitApiResponse>({
    uri: '/Taxinvoice',
    corpNum,
    userId: options.userId,
    method: 'BULKISSUE',
    submitId: submitID,
    body: stringifyWithoutEmptyValues(requestBody),
  })
}
