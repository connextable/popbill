import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath } from '../common'

/** 현금영수증 CheckMgtKeyInUse 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/info */
export type CashbillCheckMgtKeyInUseApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillCheckMgtKeyInUseApiRequestQuery = never
export type CashbillCheckMgtKeyInUseApiRequestBody = never
export type CashbillCheckMgtKeyInUseApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillCheckMgtKeyInUseApiRequestPath, CashbillCheckMgtKeyInUseApiRequestQuery, CashbillCheckMgtKeyInUseApiRequestBody>,
  'path'
>
export type CashbillCheckMgtKeyInUseApiResponse = { itemKey?: string | null }
