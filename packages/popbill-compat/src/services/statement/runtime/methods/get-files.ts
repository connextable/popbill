import { documentPath, request } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetFiles(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  userId?: string
): Promise<Spec.StatementFileApiModel[]> {
  return request(context, corpNum, `${documentPath(itemCode, mgtKey)}/Files`, userId)
}
