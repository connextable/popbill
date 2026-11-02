import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { request, numberPath } from '../common'

export async function requestCancelReserveRN(
  context: FaxRuntimeContext,
  corpNum: string,
  requestNum: string,
  userId?: string
): Promise<Spec.FaxApiResponseBase> {
  return request(context, corpNum, numberPath('/FAX/Cancel/', requestNum, '전송요청번호가 입력되지 않았습니다.'), userId)
}
