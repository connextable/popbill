import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath } from '../common'
import type { CashbillApiModel } from '../models'

/** 현금영수증 GetDetailInfo 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/info */
export type CashbillGetDetailInfoApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetDetailInfoApiRequestQuery = { Detail: '' }
export type CashbillGetDetailInfoApiRequestBody = never
export type CashbillGetDetailInfoApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetDetailInfoApiRequestPath, CashbillGetDetailInfoApiRequestQuery, CashbillGetDetailInfoApiRequestBody>,
  'path' | 'query'
>
export type CashbillGetDetailInfoApiResponse = CashbillApiModel
