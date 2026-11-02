import { request, validateStatement } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRegistIssue(
  context: StatementRuntimeContext,
  corpNum: string,
  statement: Spec.StatementApiModel,
  memo = '',
  userId = '',
  emailSubject = ''
): Promise<Spec.StatementRegistIssueApiResponse> {
  validateStatement(statement)
  return request(context, corpNum, '/Statement', userId, 'ISSUE', { ...statement, memo, emailSubject })
}
