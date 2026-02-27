import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import type { TaxInvoiceApiModel, TaxInvoiceRegistIssueApiResponse } from '@connextable/popbill-spec'
import { validateCorpNum, validateTaxinvoicePayload } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type { ParsedRegistIssueOptions } from '@/services/taxinvoice/runtime/parsers/regist-issue'

export async function requestRegistIssue(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  taxinvoice: TaxInvoiceApiModel,
  options: ParsedRegistIssueOptions
): Promise<TaxInvoiceRegistIssueApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const taxinvoiceError = validateTaxinvoicePayload(taxinvoice)
  if (taxinvoiceError) {
    throw taxinvoiceError
  }

  const requestBody: TaxInvoiceApiModel & {
    memo?: string
    emailSubject?: string
    forceIssue?: boolean
    writeSpecification?: boolean
    dealInvoiceMgtKey?: string
  } = {
    ...taxinvoice,
  }

  if (options.forceIssue) {
    requestBody.forceIssue = true
  }

  if (options.writeSpecification) {
    requestBody.writeSpecification = true
  }

  if (options.memo) {
    requestBody.memo = options.memo
  }

  if (options.emailSubject) {
    requestBody.emailSubject = options.emailSubject
  }

  if (options.dealInvoiceMgtKey) {
    requestBody.dealInvoiceMgtKey = options.dealInvoiceMgtKey
  }

  return context.requestClient.requestJson<TaxInvoiceRegistIssueApiResponse>({
    uri: '/Taxinvoice',
    corpNum,
    userId: options.userId,
    method: 'ISSUE',
    body: stringifyWithoutEmptyValues(requestBody),
  })
}
