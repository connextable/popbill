import { request, validateKeys } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetInfos(
  context: CashbillRuntimeContext,
  corpNum: string,
  mgtKeyList: string[],
  userId?: string
): Promise<Spec.CashbillInfoApiModel[]> {
  validateKeys(mgtKeyList)
  return request(context, corpNum, '/Cashbill/States', userId, 'POST', mgtKeyList)
}
