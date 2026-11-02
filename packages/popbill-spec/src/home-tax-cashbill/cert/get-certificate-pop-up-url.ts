import type { HomeTaxCashbillApiRequest, HomeTaxCashbillUrlApiResponse } from '../common'
import type { PopbillRequireRequestFields } from '../../request'
/** GET /HomeTax/Cashbill?TG=CERT. */
export type HomeTaxCashbillGetCertificatePopUpURLApiRequestPath = never
export interface HomeTaxCashbillGetCertificatePopUpURLApiRequestQuery {
  TG: 'CERT'
}
export type HomeTaxCashbillGetCertificatePopUpURLApiRequestBody = never
export type HomeTaxCashbillGetCertificatePopUpURLApiRequest = PopbillRequireRequestFields<
  HomeTaxCashbillApiRequest<never, HomeTaxCashbillGetCertificatePopUpURLApiRequestQuery, never>,
  'query'
>
export type HomeTaxCashbillGetCertificatePopUpURLApiResponse = HomeTaxCashbillUrlApiResponse
