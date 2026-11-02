import {
  createPopbillClient,
  StatementItemCodes,
  StatementStateCodes,
  type StatementDocumentInput,
  type StatementService,
} from '@connextable/popbill'
import { parseBooleanValue, parsePositiveIntegerValue, readEnvironmentString } from '../shared/environment.ts'
import { logError, logInfo, logWarn, printHeader } from '../shared/log.ts'
import { createSharedRunner, type SharedRunner } from '../shared/runner.ts'
import { createManagementKey, formatDate } from '../tax-invoice/taxinvoice-fixtures.ts'
import { formatError } from '../tax-invoice/utils/error.ts'

const modes = ['lifecycle', 'immediate', 'taxinvoice-attachment'] as const
type Mode = (typeof modes)[number]

async function main(): Promise<void> {
  const modeArgument = process.argv.slice(2).filter((argument) => argument !== '--')[0] ?? 'lifecycle'
  if (modeArgument === '--help' || modeArgument === '-h') {
    console.log(`Usage: pnpm -C examples statement -- [${modes.join('|')}]`)
    console.log('Set POPBILL_RUN_STATEMENT_EXAMPLES=true to enable test-environment API calls.')
    return
  }
  if (!modes.includes(modeArgument as Mode)) {
    throw new Error(`Unknown statement scenario: ${modeArgument}`)
  }

  const requiredNames = ['POPBILL_LINK_ID', 'POPBILL_SECRET_KEY', 'POPBILL_CORP_NUM', 'POPBILL_USER_ID'] as const
  const missingNames = requiredNames.filter((name) => !readEnvironmentString(name, ''))
  if (missingNames.length) throw new Error(`Missing environment variables: ${missingNames.join(', ')}`)
  if (!parseBooleanValue(readEnvironmentString('POPBILL_RUN_STATEMENT_EXAMPLES', 'false'), false)) {
    throw new Error('Set POPBILL_RUN_STATEMENT_EXAMPLES=true before running statement examples.')
  }
  if (!parseBooleanValue(readEnvironmentString('POPBILL_IS_TEST', 'true'), true)) {
    throw new Error('Statement examples require POPBILL_IS_TEST=true.')
  }

  const mode = modeArgument as Mode
  const invoiceManagementKey = readEnvironmentString('POPBILL_STATEMENT_TAXINVOICE_MGT_KEY', '')
  if (mode === 'taxinvoice-attachment' && !invoiceManagementKey) {
    throw new Error('Set POPBILL_STATEMENT_TAXINVOICE_MGT_KEY to an existing editable sales invoice management key.')
  }
  const client = createPopbillClient({
    linkId: readEnvironmentString('POPBILL_LINK_ID', ''),
    secretKey: readEnvironmentString('POPBILL_SECRET_KEY', ''),
    userId: readEnvironmentString('POPBILL_USER_ID', ''),
    isTest: true,
    useLocalTime: parseBooleanValue(readEnvironmentString('POPBILL_USE_LOCAL_TIME', 'true'), true),
    requestTimeoutMs: parsePositiveIntegerValue(readEnvironmentString('POPBILL_REQUEST_TIMEOUT_MS', '30000'), 30_000),
    acceptEncoding: readEnvironmentString('POPBILL_ACCEPT_ENCODING', 'gzip'),
  })
  const service = client.services.statement
  const businessNumber = readEnvironmentString('POPBILL_CORP_NUM', '')
  const managementKey = createManagementKey('STMT')
  const key = { businessNumber, documentTypeCode: StatementItemCodes.TradeStatement, managementKey }
  const document = createDocument(businessNumber, managementKey)
  const runner = createSharedRunner({ formatError })
  printHeader(`Statement: ${mode}`)
  logInfo('관리번호: 실패 시 이 번호로 상태를 조회한 뒤 정리합니다.', key)

  try {
    const usage = await step(runner, 'checkStatementManagementKeyInUse', key, () => service.checkStatementManagementKeyInUse(key))
    if (usage.isInUse) throw new Error(`Management key already exists: ${managementKey}`)

    if (mode === 'immediate') {
      await issueWithRecovery(runner, service, key, 'issueStatementImmediately', () =>
        service.issueStatementImmediately({ businessNumber, document, historyMemo: 'examples immediate issue' })
      )
    } else {
      const registerInput = { businessNumber, document }
      await step(runner, 'registerStatement', registerInput, () => service.registerStatement(registerInput))
      if (mode === 'taxinvoice-attachment') {
        await issueWithRecovery(runner, service, key, 'issueStatement', () =>
          service.issueStatement({ ...key, historyMemo: 'examples tax invoice attachment' })
        )
        const statementInfo = await step(runner, 'getStatementInfo', key, () => service.getStatementInfo(key))
        requireIssuedState(statementInfo.stateCode, managementKey)
        const attachmentInput = {
          businessNumber,
          invoiceDocumentKeyType: 'SELL' as const,
          invoiceManagementKey,
          statementItemCode: key.documentTypeCode,
          statementManagementKey: managementKey,
        }
        await step(runner, 'attachInvoiceStatement', attachmentInput, () => client.services.taxInvoice.attachInvoiceStatement(attachmentInput))
        await step(runner, 'detachInvoiceStatement', attachmentInput, () => client.services.taxInvoice.detachInvoiceStatement(attachmentInput))
        await step(runner, 'cancelIssuedStatement', key, () => service.cancelIssuedStatement({ ...key, historyMemo: 'examples cleanup' }))
        await step(runner, 'deleteStatement', key, () => service.deleteStatement(key))
        return
      }
      const updateInput = { ...key, document: { ...document, remarkOne: 'examples updated before issue' } }
      await step(runner, 'updateStatement', updateInput, () => service.updateStatement(updateInput))
      await issueWithRecovery(runner, service, key, 'issueStatement', () =>
        service.issueStatement({ ...key, historyMemo: 'examples lifecycle issue' })
      )
    }

    const info = await step(runner, 'getStatementInfo', key, () => service.getStatementInfo(key))
    await step(runner, 'getStatementDetailInfo', key, () => service.getStatementDetailInfo(key))
    await step(runner, 'getStatementViewURL', key, () => service.getStatementViewURL(key))
    await step(runner, 'getSenderStatementPrintURL', key, () => service.getSenderStatementPrintURL(key))
    requireIssuedState(info.stateCode, managementKey)
    await step(runner, 'cancelIssuedStatement', key, () => service.cancelIssuedStatement({ ...key, historyMemo: 'examples cleanup' }))
    await step(runner, 'deleteStatement', key, () => service.deleteStatement(key))
  } finally {
    logInfo('Statement example result', runner.stats)
    if (runner.stats.failed) {
      logWarn('실패 문서가 남을 수 있습니다. 발행을 재시도하기 전에 관리번호로 상태를 확인합니다.', key)
    }
  }
}

async function step<T>(runner: SharedRunner, name: string, input: unknown, operation: () => Promise<T>): Promise<T> {
  const result = await runner.run(name, input, operation)
  if (!result.ok) throw result.error
  return result.value
}

async function issueWithRecovery(
  runner: SharedRunner,
  service: StatementService,
  key: Parameters<StatementService['getStatementInfo']>[0],
  operationName: 'issueStatement' | 'issueStatementImmediately',
  operation: () => Promise<unknown>
): Promise<void> {
  const result = await runner.run(operationName, key, operation)
  if (!result.ok) {
    // A lost response does not establish that issue failed. Query the same key; never issue again here.
    await runner.run('getStatementInfo after issue error', key, () => service.getStatementInfo(key))
    throw result.error
  }
}

function requireIssuedState(stateCode: number | undefined, managementKey: string): void {
  if (stateCode !== StatementStateCodes.Issued) {
    throw new Error(`State ${stateCode} requires inspection in Popbill before continuing. Management key: ${managementKey}`)
  }
}

function createDocument(businessNumber: string, managementKey: string): StatementDocumentInput {
  const writtenDate = formatDate(new Date())
  return {
    documentTypeCode: StatementItemCodes.TradeStatement,
    managementKey,
    writtenDate,
    purposeType: '청구',
    taxType: '과세',
    documentSerialNumber: '1',
    sender: {
      businessNumber,
      companyName: '예제 발신자',
      chiefExecutiveOfficerName: '발신대표',
      address: '서울시 강남구 테스트로 1',
      businessType: '서비스',
      businessClass: '소프트웨어',
      contactName: '발신담당자',
      emailAddress: readEnvironmentString('POPBILL_RECEIVER_EMAIL', 'test@example.com'),
    },
    receiver: {
      businessNumber: readEnvironmentString('POPBILL_COUNTERPART_CORP_NUM', '8888888888'),
      companyName: '예제 수신자',
      chiefExecutiveOfficerName: '수신대표',
      address: '서울시 서초구 테스트로 2',
      contactName: '수신담당자',
      emailAddress: readEnvironmentString('POPBILL_RECEIVER_EMAIL', 'test@example.com'),
    },
    paymentSummary: { totalSupplyCostAmount: '10000', totalTaxAmount: '1000', totalAmount: '11000' },
    lineItems: [
      {
        lineNumber: 1,
        transactionDate: writtenDate,
        itemName: '예제 품목',
        specification: 'EA',
        quantity: '1',
        unitCostAmount: '10000',
        supplyCostAmount: '10000',
        taxAmount: '1000',
      },
    ],
    remarkOne: 'examples statement',
    includeBusinessLicenseImage: false,
    includeBankBookImage: false,
  }
}

main().catch((error: unknown) => {
  logError('Statement example failed', formatError(error))
  process.exitCode = 1
})
