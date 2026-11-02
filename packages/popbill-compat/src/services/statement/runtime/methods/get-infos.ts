import { request, validateItemCode, validateKeys } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetInfos(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKeyList: string[],
  userId?: string
): Promise<Spec.StatementInfoApiModel[]> {
  validateItemCode(itemCode)
  validateKeys(mgtKeyList)
  return request(context, corpNum, `/Statement/${itemCode}`, userId, 'POST', mgtKeyList)
}
