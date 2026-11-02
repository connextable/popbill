import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetChargeInfo(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  userId: string
): Promise<Spec.TaxInvoiceGetChargeInfoApiResponse> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  return context.requestClient.requestJson<Spec.TaxInvoiceGetChargeInfoApiResponse>({ uri: '/Taxinvoice/ChargeInfo', corpNum, userId, method: 'GET' })
}
