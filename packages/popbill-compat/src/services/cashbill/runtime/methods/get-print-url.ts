import { url, documentPath } from '../common'
import type { CashbillRuntimeContext } from '../context'

export async function requestGetPrintUrl(context: CashbillRuntimeContext, corpNum: string, mgtKey: string, userId?: string): Promise<string> {
  return url(context, corpNum, `${documentPath(mgtKey)}?TG=PRINT`, userId)
}
