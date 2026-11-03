/** Popbill webhook wire contracts. These credentials are independent of Linkhub API authentication.
 * @see https://developers.popbill.com/api-reference/taxinvoice/webhook/introduction
 * @see https://developers.popbill.com/api-reference/taxinvoice/webhook/webhook-event
 */
export const PopbillWebhookTypes = {
  TaxInvoice: 'TAXINVOICE.STATE',
  Cashbill: 'CASHBILL.STATE',
  Statement: 'STATEMENT.STATE',
  HomeTaxTaxInvoice: 'HT.TAXINVOICEXML',
  HomeTaxCashbill: 'HT.CASHBILL',
  Kakao: 'KAKAO.STATE',
  Message: 'SMS.STATE',
  Fax: 'FAX.STATE',
} as const

export type PopbillWebhookType = (typeof PopbillWebhookTypes)[keyof typeof PopbillWebhookTypes] | (string & {})
export type PopbillWebhookCode = number | string | null
export type PopbillWebhookFlag = boolean | number | string | null

export interface PopbillWebhookHeaders {
  'Pb-Webhook-Type': PopbillWebhookType
  'Pb-Webhook-MID': string
  'Pb-Webhook-Corpnum': string
  'Content-Type'?: string
  'Pb-Webhook-EventType'?: string
  Authorization?: string
  'X-Api-Key'?: string
}

/** Bulk item metadata. Official examples omit TYPE on some items. */
export interface PopbillWebhookBatchHeader {
  QMNum?: string
  CORPNUM?: string
  TYPE?: PopbillWebhookType
  MEMBERCODE?: string
  [key: string]: unknown
}

export interface PopbillWebhookBatchItem<T> {
  header: PopbillWebhookBatchHeader
  body: T
}

/** Dates retain the provider's yyyyMMddHHmmss representation. */
export interface PopbillWebhookEventBody {
  corpNum?: string
  eventType?: string
  eventDT?: string
  interOPYN?: PopbillWebhookFlag
}

export interface PopbillWebhookDocumentStateBody extends PopbillWebhookEventBody {
  itemKey?: string
  stateCode?: PopbillWebhookCode
  stateDT?: string
  issueDT?: string
  ntssendDT?: string
  ntsresultDT?: string
  stateMemo?: string
}

export interface PopbillWebhookBulkResultBody<T> extends PopbillWebhookEventBody {
  submitID?: string
  receiptID?: string
  receiptDT?: string
  submitCount?: number
  successCount?: number
  failCount?: number
  txState?: PopbillWebhookCode
  txResultCode?: PopbillWebhookCode
  txStartDT?: string
  txEndDT?: string
  issueResult?: T[] | null
}

export interface PopbillWebhookDeliveryBody extends PopbillWebhookEventBody {
  receiptNum?: string
  requestNum?: string
  serialNum?: number
  state?: PopbillWebhookCode
  result?: PopbillWebhookCode
  receiptDT?: string
  reserveDT?: string
  resultDT?: string
  sendDT?: string
  sendNum?: string
  receiveNum?: string
  interOPRefKey?: string
}
