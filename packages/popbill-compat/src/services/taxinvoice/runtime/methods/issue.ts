import { stringifyWithoutEmptyValues } from '@connextable/popbill-core'
import type { TaxInvoiceIssueApiResponse, TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type { ParsedIssueOptions } from '@/services/taxinvoice/runtime/parsers/issue'

export async function requestIssue(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  options: ParsedIssueOptions
): Promise<TaxInvoiceIssueApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<TaxInvoiceIssueApiResponse>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId: options.userId,
    method: 'ISSUE',
    body: stringifyWithoutEmptyValues({
      memo: options.memo,
      emailSubject: options.emailSubject,
      forceIssue: options.forceIssue,
    }),
  })
}
