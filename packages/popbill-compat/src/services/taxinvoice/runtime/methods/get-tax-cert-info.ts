import type { TaxInvoiceGetTaxCertInfoApiResponse } from '@connextable/popbill-spec'
import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetTaxCertInfo(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string
): Promise<TaxInvoiceGetTaxCertInfoApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<TaxInvoiceGetTaxCertInfoApiResponse>({
    uri: '/Taxinvoice/Certificate',
    corpNum,
    userId,
    method: 'GET',
  })
}
