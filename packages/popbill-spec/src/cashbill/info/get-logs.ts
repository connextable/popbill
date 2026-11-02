import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath } from '../common'
import type { CashbillLogApiModel } from '../models'

/** 현금영수증 GetLogs 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/info */
export type CashbillGetLogsApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetLogsApiRequestQuery = never
export type CashbillGetLogsApiRequestBody = never
export type CashbillGetLogsApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetLogsApiRequestPath, CashbillGetLogsApiRequestQuery, CashbillGetLogsApiRequestBody>,
  'path'
>
export type CashbillGetLogsApiResponse = CashbillLogApiModel[]
