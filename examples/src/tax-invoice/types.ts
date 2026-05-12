import type {
  createPopbillClient} from '@connextable/popbill';
import {
  TaxInvoiceCloseDownStateCodes,
  TaxInvoiceDateType,
  TaxInvoiceEmailTypes,
  TaxInvoiceSearchInvoiceTypeCodes,
  TaxInvoiceSearchTaxationTypeCodes,
  TaxInvoiceSortOrder,
  TaxInvoiceStatementItemCodes,
} from '@connextable/popbill'

export { TaxInvoiceCloseDownStateCodes, TaxInvoiceDateType, TaxInvoiceSearchInvoiceTypeCodes, TaxInvoiceSearchTaxationTypeCodes, TaxInvoiceSortOrder }

export type TaxInvoiceService = ReturnType<typeof createPopbillClient>['services']['taxInvoice']
export type SearchInvoicesInput = Parameters<TaxInvoiceService['searchInvoices']>[0]
export type AttachInvoiceStatementInput = Parameters<TaxInvoiceService['attachInvoiceStatement']>[0]
export type UpdateEmailSendSettingsInput = Parameters<TaxInvoiceService['updateEmailSendSettings']>[0]
export type TaxInvoiceStatementItemCode = AttachInvoiceStatementInput['statementItemCode']
export type TaxInvoiceEmailType = UpdateEmailSendSettingsInput['emailType']

export const TAX_INVOICE_STATEMENT_ITEM_CODES = Object.values(TaxInvoiceStatementItemCodes) as readonly TaxInvoiceStatementItemCode[]
export const DEFAULT_TAX_INVOICE_STATEMENT_ITEM_CODE: TaxInvoiceStatementItemCode = TaxInvoiceStatementItemCodes.TradeStatement
export const DEFAULT_TAX_INVOICE_EMAIL_TYPE: TaxInvoiceEmailType = TaxInvoiceEmailTypes.TaxIssue

export interface RuntimeConfig {
  linkId: string
  secretKey: string
  corpNum: string
  userId: string
  isTest: boolean
  useLocalTime: boolean
  requestTimeoutMs: number
  acceptEncoding: string | null
  counterpartCorpNum: string
  receiverEmail: string
  senderPhoneNumber: string
  receiverPhoneNumber: string
  senderFaxNumber: string
  receiverFaxNumber: string
  statementItemCode: TaxInvoiceStatementItemCode
  statementManagementKey: string
  missingNames: string[]
}

export interface ExampleContext {
  service: TaxInvoiceService
  businessNumber: string
  invoiceDocumentKeyType: 'SELL'
  today: string
  searchStartDate: string
  config: RuntimeConfig
  shared: {
    primaryIssuedManagementKey: string
  }
}

export interface RunnerStats {
  total: number
  passed: number
  failed: number
  failures: string[]
}

export interface RunSuccess<T> {
  ok: true
  value: T
}

export interface RunFailure {
  ok: false
  error: unknown
}

export type RunResult<T> = RunSuccess<T> | RunFailure

export interface Runner {
  stats: RunnerStats
  run<T>(name: string, input: unknown, operation: () => Promise<T>, summarize?: (value: T) => unknown): Promise<RunResult<T>>
}

export interface ScenarioDefinition {
  description: string
  run: (context: ExampleContext, runner: Runner) => Promise<void>
}
