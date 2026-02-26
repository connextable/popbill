import { createPopbillClient } from '@connextable/popbill'

export type TaxInvoiceService = ReturnType<typeof createPopbillClient>['services']['taxInvoice']

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
  statementItemCode: number
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
  run<T>(
    name: string,
    input: unknown,
    operation: () => Promise<T>,
    summarize?: (value: T) => unknown
  ): Promise<RunResult<T>>
}

export interface ScenarioDefinition {
  description: string
  run: (context: ExampleContext, runner: Runner) => Promise<void>
}
