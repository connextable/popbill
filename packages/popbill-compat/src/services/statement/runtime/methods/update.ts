import { documentPath, request, validateStatement } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestUpdate(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  statement: Spec.StatementApiModel,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  validateStatement(statement)
  return request(context, corpNum, documentPath(itemCode, mgtKey), userId, 'PATCH', statement)
}
