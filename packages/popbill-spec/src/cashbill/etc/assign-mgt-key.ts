import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillApiResponseBase } from '../common'

/** 현금영수증 AssignMgtKey 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/etc */
export type CashbillAssignMgtKeyApiRequestPath = { ItemKey: string }
export type CashbillAssignMgtKeyApiRequestQuery = never
export type CashbillAssignMgtKeyApiRequestBody = { MgtKey: string }
export type CashbillAssignMgtKeyApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillAssignMgtKeyApiRequestPath, CashbillAssignMgtKeyApiRequestQuery, CashbillAssignMgtKeyApiRequestBody>,
  'path' | 'body'
>
export type CashbillAssignMgtKeyApiResponse = CashbillApiResponseBase
