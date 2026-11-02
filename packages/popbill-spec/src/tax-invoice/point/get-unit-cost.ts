import type { TaxInvoiceApiRequest, TaxInvoiceRequireRequestFields } from '../common'

export interface TaxInvoiceGetUnitCostApiRequestQuery {
  cfg: 'UNITCOST'
}

/** Source: https://developers.popbill.com/reference/taxinvoice/node/common-api/point#GetUnitCost */
export type TaxInvoiceGetUnitCostApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<never, TaxInvoiceGetUnitCostApiRequestQuery>,
  'query'
>

export interface TaxInvoiceGetUnitCostApiResponse {
  unitCost: string
}
