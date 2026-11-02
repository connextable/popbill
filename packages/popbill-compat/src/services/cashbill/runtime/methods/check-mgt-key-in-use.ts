import { documentPath, request } from '../common'
import type { CashbillRuntimeContext } from '../context'

export async function requestCheckMgtKeyInUse(context: CashbillRuntimeContext, corpNum: string, mgtKey: string, userId?: string): Promise<boolean> {
  const result = await request<{ itemKey?: string | null }>(context, corpNum, documentPath(mgtKey), userId)
  return result.itemKey !== undefined && result.itemKey !== null
}
