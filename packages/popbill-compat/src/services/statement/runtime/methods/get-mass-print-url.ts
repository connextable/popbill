import { url, validateItemCode, validateKeys } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'

export async function requestGetMassPrintUrl(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKeyList: string[],
  userId?: string
): Promise<string> {
  validateItemCode(itemCode)
  validateKeys(mgtKeyList)
  return url(context, corpNum, `/Statement/${itemCode}?Print`, userId, 'POST', mgtKeyList)
}
