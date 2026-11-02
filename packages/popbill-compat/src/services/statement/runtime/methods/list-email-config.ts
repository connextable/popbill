import { request } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestListEmailConfig(
  context: StatementRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.StatementEmailConfigApiModel[]> {
  return request(context, corpNum, '/Statement/EmailSendConfig', userId)
}
