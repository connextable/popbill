import { requestLookup, type LookupRuntimeContext } from '@/internal/lookup-runtime'

export async function requestGetUnitCost(context: LookupRuntimeContext, corpNum: string): Promise<string> {
  return (await requestLookup<{ unitCost: string }>(context, corpNum, '/BizInfo/UnitCost')).unitCost
}
