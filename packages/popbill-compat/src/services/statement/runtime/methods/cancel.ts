import { documentPath, request } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestCancel(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  memo = '',
  userId = ''
): Promise<Spec.StatementApiResponseBase> {
  return request(context, corpNum, documentPath(itemCode, mgtKey), userId, 'CANCEL', { memo })
}
