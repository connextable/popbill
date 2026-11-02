import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { request, numberPath } from '../common'

export async function requestGetFaxResult(
  context: FaxRuntimeContext,
  corpNum: string,
  receiptNum: string,
  userId?: string
): Promise<Spec.FaxResultApiModel[]> {
  return request(context, corpNum, numberPath('/FAX/', receiptNum, '접수번호가 입력되지 않았습니다.'), userId)
}
