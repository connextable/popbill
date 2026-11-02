import { request, validateStatement } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRegister(
  context: StatementRuntimeContext,
  corpNum: string,
  statement: Spec.StatementApiModel,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  validateStatement(statement)
  return request(context, corpNum, '/Statement', userId, 'POST', statement)
}
