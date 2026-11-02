import { documentPath, url } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'

export async function requestGetEPrintUrl(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  userId?: string
): Promise<string> {
  return url(context, corpNum, `${documentPath(itemCode, mgtKey)}?TG=EPRINT`, userId)
}
