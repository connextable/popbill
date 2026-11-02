import { createPopbillClient } from '@connextable/popbill'
import { parseBooleanValue, readEnvironmentString } from '../shared/environment.ts'

async function main(): Promise<void> {
  const mode = process.argv.slice(2).filter((argument) => argument !== '--')[0] ?? 'state'
  if (mode === '--help' || mode === '-h') {
    console.log('Usage from examples/: pnpm exec dotenvx run -- jiti src/easy-fin-bank/run-easy-fin-bank.ts [request|state|search|summary]')
    console.log(
      'Set POPBILL_RUN_EASYFINBANK_EXAMPLES=true and POPBILL_IS_TEST=true. A registered bank account and an active subscription are required.'
    )
    console.log(
      'request: POPBILL_BANK_CODE, POPBILL_BANK_ACCOUNT_NUMBER, POPBILL_BANK_START_DATE/END_DATE=yyyyMMdd. Other modes: POPBILL_BANK_COLLECTION_ID.'
    )
    return
  }
  if (!['request', 'state', 'search', 'summary'].includes(mode)) throw new Error(`Unknown mode: ${mode}`)
  if (!parseBooleanValue(readEnvironmentString('POPBILL_RUN_EASYFINBANK_EXAMPLES', 'false'), false))
    throw new Error('Set POPBILL_RUN_EASYFINBANK_EXAMPLES=true.')
  if (!parseBooleanValue(readEnvironmentString('POPBILL_IS_TEST', 'true'), true)) throw new Error('Bank examples require POPBILL_IS_TEST=true.')
  const required = (name: string) => {
    const value = readEnvironmentString(name, '')
    if (!value) throw new Error(`Missing environment variable: ${name}`)
    return value
  }
  const client = createPopbillClient({
    linkId: required('POPBILL_LINK_ID'),
    secretKey: required('POPBILL_SECRET_KEY'),
    userId: required('POPBILL_USER_ID'),
    isTest: true,
  })
  const service = client.services.easyFinBank
  const businessNumber = required('POPBILL_CORP_NUM')
  if (mode === 'request') {
    const receipt = await service.requestCollection({
      businessNumber,
      bankCode: required('POPBILL_BANK_CODE'),
      accountNumber: required('POPBILL_BANK_ACCOUNT_NUMBER'),
      startDate: required('POPBILL_BANK_START_DATE'),
      endDate: required('POPBILL_BANK_END_DATE'),
    })
    console.log('Collection ID (valid for one hour after request):', receipt.collectionId)
    return
  }
  const request = { businessNumber, collectionId: required('POPBILL_BANK_COLLECTION_ID') }
  const state = await service.getCollectionStatus(request)
  console.log(state)
  if (mode === 'state') return
  if (!state.isSuccessful)
    throw new Error('Search requires stateCode=3 and resultCode=1. Check state again, or request a new collection after failure/expiration.')
  // Summaries avoid printing account transaction details from this example.
  if (mode === 'search') {
    const result = await service.searchTransactions({ ...request, pageSize: 100 })
    console.log({
      totalCount: result.totalCount,
      pageNumber: result.pageNumber,
      pageSize: result.pageSize,
      returnedCount: result.transactions.length,
    })
  } else console.log(await service.summarizeTransactions(request))
}

await main()
