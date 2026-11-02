import type { FaxRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { request, numberPath } from '../common'

export async function requestCheckSenderNumber(
  context: FaxRuntimeContext,
  corpNum: string,
  senderNumber: string,
  userId?: string
): Promise<Spec.FaxApiResponseBase> {
  return request(context, corpNum, numberPath('/FAX/CheckSenderNumber/', senderNumber, '확인할 발신번호가 입력되지 않았습니다.'), userId)
}
