import type {
  PopbillWebhookInput,
  PopbillWebhookSuccessResponse,
  ParsedPopbillWebhookMessage,
  ParsedPopbillWebhookItem,
} from '@connextable/popbill-runtime'
import type { ProviderBoolean, ProviderNumericCode } from '@connextable/popbill-utils'
import type { TaxInvoiceInfo, TaxInvoiceBulkIssueSubmissionResult } from '../services/tax-invoice/types'
import type { CashbillInfo, CashbillBulkResult } from '../services/cashbill/types'
import type { StatementInfo } from '../services/statement/types'
import type { HomeTaxTaxInvoiceDocument } from '../services/home-tax-tax-invoice/types'
import type { HomeTaxCashbillReceipt } from '../services/home-tax-cashbill/types'
import type { KakaoMessage } from '../services/kakao/types'
import type { SentMessage } from '../services/message/types'
import type { FaxResult } from '../services/fax/types'

/** Fields shared by typed event bodies. Provider flags retain unknown values and null. */
export interface PopbillWebhookEventData {
  businessNumber?: string
  isApiLinkedDocument?: ProviderBoolean
}

export interface PopbillWebhookDeliveryData extends PopbillWebhookEventData {
  sequenceNumber?: number
}

/** State callbacks omit party/detail fields required by the full invoice API. */
export type TaxInvoiceStateWebhookData = Partial<TaxInvoiceInfo> & Pick<TaxInvoiceInfo, 'itemKey'> & PopbillWebhookEventData
/** Bulk callbacks have no top-level API operation code/message. */
export type TaxInvoiceBulkWebhookData = Omit<TaxInvoiceBulkIssueSubmissionResult, 'resultCode' | 'resultMessage'> & PopbillWebhookEventData
export interface TaxInvoiceCertificateWebhookData extends PopbillWebhookEventData {
  expiresAt?: string
  registeredByUserId?: string
  issuerDistinguishedName?: string
  subjectDistinguishedName?: string
  policyIdentifier?: string
}

export type CashbillStateWebhookData = CashbillInfo & PopbillWebhookEventData
export type CashbillBulkWebhookData = Omit<CashbillBulkResult, 'resultCode' | 'resultMessage'> & PopbillWebhookEventData
export type StatementWebhookData = StatementInfo & PopbillWebhookEventData
export type HomeTaxTaxInvoiceWebhookData = HomeTaxTaxInvoiceDocument & { sentDate?: string }
export type HomeTaxCashbillWebhookData = HomeTaxCashbillReceipt

export type KakaoWebhookData = Omit<KakaoMessage, 'stateCode' | 'resultCode' | 'fallbackResultCode' | 'contentTypeCode'> &
  PopbillWebhookDeliveryData & {
    stateCode?: ProviderNumericCode
    resultCode?: ProviderNumericCode
    fallbackResultCode?: ProviderNumericCode
    contentTypeCode?: ProviderNumericCode
  }
export type MessageWebhookData = SentMessage & PopbillWebhookDeliveryData
export type FaxWebhookData = Omit<FaxResult, 'stateCode' | 'resultCode' | 'recipientNumberType' | 'convertedFileSize'> &
  PopbillWebhookDeliveryData & {
    stateCode?: ProviderNumericCode
    resultCode?: ProviderNumericCode
    recipientNumberType?: string
    convertedFileSize?: number
  }

/** Each batch event carries its own member/type metadata, independently of the delivery headers. */
export interface PopbillWebhookEventSource extends Omit<ParsedPopbillWebhookItem, 'body'> {
  eventType?: string
  /** Provider eventDT without timezone conversion; absent on HomeTax collection callbacks. */
  occurredAt?: string
  raw: Record<string, unknown>
}

/** Closed kind discriminants allow safe narrowing even when a new provider event is unknown. */
export type PopbillWebhookEvent = PopbillWebhookEventSource &
  (
    | { kind: 'taxInvoice.state'; data: TaxInvoiceStateWebhookData }
    | { kind: 'taxInvoice.bulkResult'; data: TaxInvoiceBulkWebhookData }
    | { kind: 'taxInvoice.certificate'; data: TaxInvoiceCertificateWebhookData }
    | { kind: 'cashbill.state'; data: CashbillStateWebhookData }
    | { kind: 'cashbill.bulkResult'; data: CashbillBulkWebhookData }
    | { kind: 'statement.state'; data: StatementWebhookData }
    | { kind: 'homeTaxTaxInvoice.collected'; data: HomeTaxTaxInvoiceWebhookData }
    | { kind: 'homeTaxCashbill.collected'; data: HomeTaxCashbillWebhookData }
    | { kind: 'kakao.result'; data: KakaoWebhookData }
    | { kind: 'message.result'; data: MessageWebhookData }
    | { kind: 'fax.result'; data: FaxWebhookData }
    | { kind: 'unknown'; data: unknown }
  )

export interface PopbillWebhookMessage extends Omit<ParsedPopbillWebhookMessage, 'items'> {
  /** Always an array in input order, including single-object deliveries. No batch item is silently discarded. */
  events: PopbillWebhookEvent[]
}

/** An independent receiver; no API client, network request, database, or HTTP server is created. */
export interface PopbillWebhookReceiver {
  /** Authenticate and parse one delivery. Unknown events retain their original body. */
  parse(input: PopbillWebhookInput): PopbillWebhookMessage
  /** Build the acknowledgement after the application has durably accepted the delivery. */
  createSuccessResponse(): PopbillWebhookSuccessResponse
}
