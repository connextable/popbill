import type { FaxRuntimeContext } from '../context'
import { request, receiveNumberType } from '../common'

export async function requestGetUnitCost(context: FaxRuntimeContext, corpNum: string, type?: string | null, userId?: string): Promise<string> {
  return (
    await request<{ unitCost: string }>(context, corpNum, '/FAX/UnitCost?receiveNumType=' + encodeURIComponent(receiveNumberType(type)), userId)
  ).unitCost
}
