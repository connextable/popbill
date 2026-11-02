import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { request, numberPath } from '../common'

export async function requestGetFaxResultRN(
  context: FaxRuntimeContext,
  corpNum: string,
  requestNum: string,
  userId?: string
): Promise<Spec.FaxResultApiModel[]> {
  return request(context, corpNum, numberPath('/FAX/Get/', requestNum, '전송요청번호가 입력되지 않았습니다.'), userId)
}
