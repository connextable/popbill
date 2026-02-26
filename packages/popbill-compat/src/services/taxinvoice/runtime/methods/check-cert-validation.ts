import type { TaxInvoiceApiResponseBase } from '@connextable/popbill-spec'
import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestCheckCertValidation(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string
): Promise<TaxInvoiceApiResponseBase> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: '/Taxinvoice/CertCheck',
    corpNum,
    userId,
    method: 'GET',
  })
}
