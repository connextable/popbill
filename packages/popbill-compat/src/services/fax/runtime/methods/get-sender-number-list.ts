import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { request } from '../common'

export async function requestGetSenderNumberList(
  context: FaxRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.FaxSenderNumberApiModel[]> {
  return request(context, corpNum, '/FAX/SenderNumber', userId)
}
