import { request, requiredText } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestRegistDeptUser(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  departmentUserId: string,
  departmentUserPassword: string,
  ...options: (string | null | undefined)[]
): Promise<Spec.HomeTaxCashbillApiResponseBase> {
  requiredText(departmentUserId, '홈택스 현금영수증 부서사용자 아이디가 입력되지 않았습니다.')
  requiredText(departmentUserPassword, '홈택스 현금영수증 부서사용자 비밀번호가 입력되지 않았습니다.')
  // 레거시의 짧은 오버로드는 IdentityNum 없이 바로 UserID를 받습니다.
  const identityNumber = options.length >= 2 ? options[0] : undefined
  const userId = options.length >= 2 ? options[1] : options[0]
  return request(context, corpNum, '/HomeTax/Cashbill/DeptUser', userId ?? undefined, 'POST', {
    id: departmentUserId,
    pwd: departmentUserPassword,
    secAuth: identityNumber,
  })
}
