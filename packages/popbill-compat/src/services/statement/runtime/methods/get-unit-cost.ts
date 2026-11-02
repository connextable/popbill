import { request, validateItemCode } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'

export async function requestGetUnitCost(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  userId?: string
): Promise<string> {
  validateItemCode(itemCode)
  const response = await request<{ unitCost: string }>(context, corpNum, `/Statement/${itemCode}?cfg=UNITCOST`, userId)
  return response.unitCost
}
