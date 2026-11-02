import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { request, receiveNumberType } from '../common'

export async function requestGetChargeInfo(
  context: FaxRuntimeContext,
  corpNum: string,
  type?: string | null,
  userId?: string
): Promise<Spec.FaxChargeInfoApiModel> {
  return request(context, corpNum, '/FAX/ChargeInfo?receiveNumType=' + encodeURIComponent(receiveNumberType(type)), userId)
}
