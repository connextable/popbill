import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { encodePathSegment, validateRequiredTaxinvoiceInputs, validateTaxinvoiceKeyTypeAllowed } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type { ParsedIssueOptions } from '@/services/taxinvoice/runtime/parsers/issue'
import type * as Spec from '@connextable/popbill-spec'

export async function requestIssue(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  options: ParsedIssueOptions
): Promise<Spec.TaxInvoiceIssueApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  validateTaxinvoiceKeyTypeAllowed(keyType, ['SELL', 'TRUSTEE'])

  return context.requestClient.requestJson<Spec.TaxInvoiceIssueApiResponse>({
    uri: `/Taxinvoice/${keyType}/${encodePathSegment(mgtKey)}`,
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
