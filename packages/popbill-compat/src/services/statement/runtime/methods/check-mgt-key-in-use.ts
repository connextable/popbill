import { documentPath, request } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'

export async function requestCheckMgtKeyInUse(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  userId?: string
): Promise<boolean> {
  const response = await request<{ itemKey?: string | null }>(context, corpNum, documentPath(itemCode, mgtKey), userId)
  return response.itemKey !== undefined && response.itemKey !== null
}
