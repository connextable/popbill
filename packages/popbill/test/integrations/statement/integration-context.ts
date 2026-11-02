import { randomUUID } from 'node:crypto'
import {
  createPopbillClient,
  StatementItemCodes,
  StatementPurposeTypes,
  StatementTaxationTypes,
  TaxInvoiceDocumentKeyTypes,
  type StatementDocumentInput,
} from '@/index'

const runRealTests = /^(true|1|yes)$/i.test(process.env['POPBILL_RUN_STATEMENT_REAL_INTEGRATION_TESTS']?.trim() ?? '')
const requiredNames = ['POPBILL_LINK_ID', 'POPBILL_SECRET_KEY', 'POPBILL_CORP_NUM', 'POPBILL_USER_ID'] as const
const missingNames = requiredNames.filter((name) => !process.env[name]?.trim())

if (runRealTests && missingNames.length > 0) {
  throw new Error(`Missing required real statement integration env vars: ${missingNames.join(', ')}`)
}

const describeRealStatementIntegration = runRealTests ? describe : describe.skip

export function describeStatementIntegration(suiteName: string, definition: () => void): void {
  describeRealStatementIntegration(suiteName, definition)
}

export function createStatementIntegrationContext() {
  const businessNumber = process.env['POPBILL_CORP_NUM']?.trim() ?? ''
  const client = createPopbillClient({
    linkId: process.env['POPBILL_LINK_ID']?.trim() ?? '',
    secretKey: process.env['POPBILL_SECRET_KEY']?.trim() ?? '',
    userId: process.env['POPBILL_USER_ID']?.trim() ?? '',
    isTest: true,
    useLocalTime: true,
    requestTimeoutMs: 30_000,
  })

  return {
    client,
    businessNumber,
    counterpartBusinessNumber: process.env['POPBILL_COUNTERPART_CORP_NUM']?.trim() || '8888888888',
    service: client.services.statement,
  }
}

export type StatementIntegrationContext = ReturnType<typeof createStatementIntegrationContext>

export function createStatementDocument(context: StatementIntegrationContext, managementKey: string): StatementDocumentInput {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date())
    .replaceAll('-', '')
  return {
    documentTypeCode: StatementItemCodes.TradeStatement,
    managementKey,
    writtenDate: today,
    purposeType: StatementPurposeTypes.Claim,
    taxType: StatementTaxationTypes.Taxable,
    sender: { businessNumber: context.businessNumber, companyName: '통합테스트 발신자', chiefExecutiveOfficerName: '대표자' },
    receiver: { businessNumber: context.counterpartBusinessNumber, companyName: '통합테스트 수신자' },
    paymentSummary: { totalSupplyCostAmount: '10000', totalTaxAmount: '1000', totalAmount: '11000' },
    lineItems: [{ lineNumber: 1, transactionDate: today, itemName: '통합테스트 품목', quantity: '1', supplyCostAmount: '10000', taxAmount: '1000' }],
    propertyBag: { Balance: '0', Deposit: '0', CBalance: '11000' },
  }
}

export function createStatementManagementKey(): string {
  return `ST${randomUUID().replaceAll('-', '').slice(0, 22)}`
}

/** A unique key gives this test ownership even when a create response is lost. */
export async function withOwnedStatement(context: StatementIntegrationContext, run: (managementKey: string) => Promise<void>): Promise<void> {
  const managementKey = createStatementManagementKey()
  await runWithCleanup(
    () => run(managementKey),
    async () => {
      try {
        const key = { businessNumber: context.businessNumber, documentTypeCode: StatementItemCodes.TradeStatement, managementKey }
        const info = await context.service.getStatementInfo(key)
        if (info.stateCode !== 100 && info.stateCode !== 500) {
          await context.service.cancelIssuedStatement({ ...key, historyMemo: 'integration cleanup' })
        }
        await context.service.deleteStatement(key)
      } catch (error) {
        if (!hasErrorCode(error, [-12000000, -12000004])) throw error
      }
    }
  )
}

export async function withOwnedDraftInvoice(
  context: StatementIntegrationContext,
  managementKey: string,
  run: (key: { businessNumber: string; invoiceDocumentKeyType: 'SELL'; invoiceManagementKey: string }) => Promise<void>
): Promise<void> {
  const key = {
    businessNumber: context.businessNumber,
    invoiceDocumentKeyType: TaxInvoiceDocumentKeyTypes.Sales,
    invoiceManagementKey: managementKey,
  }
  await runWithCleanup(
    () => run(key),
    async () => {
      try {
        await context.client.services.taxInvoice.deleteInvoice(key)
      } catch (error) {
        if (!hasErrorCode(error, [-11000000, -11000005])) throw error
      }
    }
  )
}

async function runWithCleanup(run: () => Promise<void>, cleanup: () => Promise<void>): Promise<void> {
  const errors: unknown[] = []
  try {
    await run()
  } catch (error) {
    errors.push(error)
  }
  try {
    await cleanup()
  } catch (error) {
    errors.push(error)
  }
  if (errors.length === 1) throw errors[0]
  if (errors.length > 1) throw new AggregateError(errors, 'Integration and cleanup failed')
}

function hasErrorCode(error: unknown, codes: number[]): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'number' && codes.includes(error.code)
}
