import type { TaxInvoiceApiRequest } from '../common'

/** Source: https://developers.popbill.com/reference/taxinvoice/node/common-api/point#GetChargeInfo */
export type TaxInvoiceGetChargeInfoApiRequest = TaxInvoiceApiRequest

/** 전자세금계산서 서비스 과금정보. 금액 문자열을 원문 그대로 보존한다. */
export interface TaxInvoiceGetChargeInfoApiResponse {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
