import { validateCorpNum } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetUnitCost(context: TaxinvoiceRuntimeContext, corpNum: string): Promise<string> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  const response = await context.requestClient.requestJson<Spec.TaxInvoiceGetUnitCostApiResponse>({
    uri: '/Taxinvoice?cfg=UNITCOST',
    corpNum,
    method: 'GET',
  })
  return response.unitCost
}
