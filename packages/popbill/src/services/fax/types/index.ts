import type { WithPopbillCallOptions } from '@/client/call-options'
import type * as Request from './request'
import type * as Response from './response'

export type * from './request'
export type * from './response'

export interface FaxService extends WithPopbillCallOptions<FaxServiceOperations> {}

interface FaxServiceOperations {
  /** Compat: `getSenderNumberMgtURL` */
  getFaxSenderRegistrationURL(input: Request.FaxBusinessInput): Promise<Response.FaxAccessURL>
  /** Compat: `getSenderNumberList` */
  getSenderNumbers(input: Request.FaxBusinessInput): Promise<Response.FaxSenderNumber[]>
  /** Compat: `checkSenderNumber` */
  checkSenderNumber(input: Request.CheckFaxSenderInput): Promise<Response.FaxOperationResult>
  /** Compat: `sendFax` */
  sendFaxFromPaths(input: Request.SendFaxFromPathsInput): Promise<Response.FaxReceipt>
  /** Compat: `sendFaxBinary` */
  sendFaxFromBinary(input: Request.SendFaxFromBinaryInput): Promise<Response.FaxReceipt>
  /** Compat: `resendFax` */
  resendFaxByReceipt(input: Request.ResendFaxByReceiptInput): Promise<Response.FaxReceipt>
  /** Compat: `resendFaxRN` */
  resendFaxByRequest(input: Request.ResendFaxByRequestInput): Promise<Response.FaxReceipt>
  /** Compat: `cancelReserve` */
  cancelScheduledFaxByReceipt(input: Request.FaxReceiptInput): Promise<Response.FaxOperationResult>
  /** Compat: `cancelReserveRN` */
  cancelScheduledFaxByRequest(input: Request.FaxRequestInput): Promise<Response.FaxOperationResult>
  /** Compat: `getFaxResult` */
  getFaxResultsByReceipt(input: Request.FaxReceiptInput): Promise<Response.FaxResult[]>
  /** Compat: `getFaxResultRN` */
  getFaxResultsByRequest(input: Request.FaxRequestInput): Promise<Response.FaxResult[]>
  /** Compat: `search` */
  searchFaxes(input: Request.SearchFaxesInput): Promise<Response.FaxSearchResult>
  /** Compat: `getSentListURL` */
  getSentFaxListURL(input: Request.FaxBusinessInput): Promise<Response.FaxAccessURL>
  /** Compat: `getPreviewURL` */
  getFaxPreviewURL(input: Request.FaxReceiptInput): Promise<Response.FaxAccessURL>
  /** Compat: `getUnitCost` */
  getUnitCost(input: Request.FaxPricingInput): Promise<Response.FaxUnitCost>
  /** Compat: `getChargeInfo` */
  getChargeInfo(input: Request.FaxPricingInput): Promise<Response.FaxChargeInfo>
}
