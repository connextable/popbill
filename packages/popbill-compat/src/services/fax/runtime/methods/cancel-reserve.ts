import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { request, numberPath } from '../common'

export async function requestCancelReserve(
  context: FaxRuntimeContext,
  corpNum: string,
  receiptNum: string,
  userId?: string
): Promise<Spec.FaxApiResponseBase> {
  return request(context, corpNum, numberPath('/FAX/', receiptNum, '접수번호가 입력되지 않았습니다.') + '/Cancel', userId)
}
