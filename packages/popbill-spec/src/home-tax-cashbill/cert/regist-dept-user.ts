import type { HomeTaxCashbillApiRequest, HomeTaxCashbillApiResponseBase } from '../common'
import type { PopbillRequireRequestFields } from '../../request'
/** POST /HomeTax/Cashbill/DeptUser. */
export type HomeTaxCashbillRegistDeptUserApiRequestPath = never
export type HomeTaxCashbillRegistDeptUserApiRequestQuery = never
export interface HomeTaxCashbillRegistDeptUserApiRequestBody {
  id: string
  pwd: string
  /** 2차인증이 설정된 경우 대표자 주민번호 앞 7자리. 해제된 경우 빈 문자열 또는 null. */
  secAuth?: string | null
}
export type HomeTaxCashbillRegistDeptUserApiRequest = PopbillRequireRequestFields<
  HomeTaxCashbillApiRequest<never, never, HomeTaxCashbillRegistDeptUserApiRequestBody>,
  'body'
>
export type HomeTaxCashbillRegistDeptUserApiResponse = HomeTaxCashbillApiResponseBase
