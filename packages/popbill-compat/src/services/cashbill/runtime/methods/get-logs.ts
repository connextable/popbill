import { request, documentPath } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetLogs(
  context: CashbillRuntimeContext,
  corpNum: string,
  mgtKey: string,
  userId?: string
): Promise<Spec.CashbillLogApiModel[]> {
  return request(context, corpNum, `${documentPath(mgtKey)}/Logs`, userId)
}
