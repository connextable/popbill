import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestCheckCertValidation(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: '/Taxinvoice/CertCheck',
    corpNum,
    userId,
    method: 'GET',
  })
}
