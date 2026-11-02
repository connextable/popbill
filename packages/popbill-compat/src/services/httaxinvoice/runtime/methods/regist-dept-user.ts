import type * as Spec from '@connextable/popbill-spec'
import { BASE_PATH, request, required } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'
export function requestRegistDeptUser(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  departmentUserId: string,
  departmentPassword: string,
  ...options: [userId?: string] | [identityNumber: string | null | undefined, userId: string | undefined]
): Promise<Spec.HomeTaxTaxInvoiceApiResponseBase> {
  required(departmentUserId, '홈택스 전자세금계산서 부서사용자 아이디가 입력되지 않았습니다.')
  required(departmentPassword, '홈택스 전자세금계산서 부서사용자 비밀번호가 입력되지 않았습니다.')
  const identityNumber = options.length > 1 ? options[0] : undefined
  const userId = options.length > 1 ? options[1] : options[0]
  return request(context, corpNum, `${BASE_PATH}/DeptUser`, userId ?? undefined, 'POST', {
    id: departmentUserId,
    pwd: departmentPassword,
    secAuth: identityNumber,
  })
}
