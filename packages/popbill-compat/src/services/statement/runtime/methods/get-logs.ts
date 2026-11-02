import { documentPath, request } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetLogs(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  userId?: string
): Promise<Spec.StatementLogApiModel[]> {
  return request(context, corpNum, `${documentPath(itemCode, mgtKey)}/Logs`, userId)
}
