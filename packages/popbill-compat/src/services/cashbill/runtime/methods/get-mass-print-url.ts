import { url, validateKeys } from '../common'
import type { CashbillRuntimeContext } from '../context'

export async function requestGetMassPrintUrl(
  context: CashbillRuntimeContext,
  corpNum: string,
  mgtKeyList: string[],
  userId?: string
): Promise<string> {
  validateKeys(mgtKeyList)
  return url(context, corpNum, '/Cashbill/Prints', userId, 'POST', mgtKeyList)
}
