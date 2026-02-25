import type {
  TaxInvoiceGetBulkResultApiResponse,
} from '@connextable/popbill-spec'
import {
  validateCorpNum,
  validateSubmitId,
} from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetBulkResult(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  submitID: string,
  userId: string,
): Promise<TaxInvoiceGetBulkResultApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const submitIdError = validateSubmitId(submitID)
  if (submitIdError) {
    throw submitIdError
  }

  return context.requestClient.requestJson<TaxInvoiceGetBulkResultApiResponse>({
    uri: `/Taxinvoice/BULK/${submitID}/State`,
    corpNum,
    userId,
    method: 'GET',
  })
}
