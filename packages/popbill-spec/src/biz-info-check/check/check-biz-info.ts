import type { BizInfoCheckApiRequest, BizInfoCheckRequireRequestFields } from '../common'
import type { BizInfoCheckCompanyInfoApiModel } from '../models'

/** GET /BizInfo/Check. @see https://developers.popbill.com/api-reference/bizinfocheck/api/check#CheckBizInfo */
export interface BizInfoCheckCheckBizInfoApiRequestQuery {
  CN: string
}
export type BizInfoCheckCheckBizInfoApiRequest = BizInfoCheckRequireRequestFields<
  BizInfoCheckApiRequest<BizInfoCheckCheckBizInfoApiRequestQuery>,
  'query'
>
export type BizInfoCheckCheckBizInfoApiResponse = BizInfoCheckCompanyInfoApiModel
