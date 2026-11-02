import { request } from '../common'
import type { CashbillRuntimeContext } from '../context'

export async function requestGetUnitCost(context: CashbillRuntimeContext, corpNum: string): Promise<string> {
  const response = await request<{ unitCost: string }>(context, corpNum, '/Cashbill?cfg=UNITCOST')
  return response.unitCost
}
