
import { validateCorpNum, validateSubmitId } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetBulkResult(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  submitID: string,
  userId: string
): Promise<Spec.TaxInvoiceGetBulkResultApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const submitIdError = validateSubmitId(submitID)
  if (submitIdError) {
    throw submitIdError
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceGetBulkResultApiResponse>({
    uri: `/Taxinvoice/BULK/${submitID}/State`,
    corpNum,
    userId,
    method: 'GET',
  })
}
