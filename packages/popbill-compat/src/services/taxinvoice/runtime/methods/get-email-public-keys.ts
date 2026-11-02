import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetEmailPublicKeys(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string
): Promise<Spec.TaxInvoiceGetEmailPublicKeysApiResponse> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  return context.requestClient.requestJson<Spec.TaxInvoiceGetEmailPublicKeysApiResponse>({
    uri: '/Taxinvoice/EmailPublicKeys',
    corpNum,
    userId,
    method: 'GET',
  })
}
