import { createPopbillClient } from '@connextable/popbill'
import { parseBooleanValue, readEnvironmentString } from '../shared/environment.ts'

async function main(): Promise<void> {
  const mode = process.argv.slice(2).filter((argument) => argument !== '--')[0] ?? 'state'
  if (mode === '--help' || mode === '-h') {
    console.log('Usage: pnpm -C examples hometax:cashbill -- [request|state|search|summary]')
    console.log(
      'Set POPBILL_RUN_HTCASHBILL_EXAMPLES=true and POPBILL_IS_TEST=true. Existing HomeTax authentication and a flat-rate contract are required.'
    )
    console.log(
      'request: POPBILL_HTCASHBILL_DIRECTION=SELL|BUY, POPBILL_HTCASHBILL_START_DATE/END_DATE=yyyyMMdd. Other modes: POPBILL_HTCASHBILL_JOB_ID.'
    )
    return
  }
  if (!['request', 'state', 'search', 'summary'].includes(mode)) throw new Error(`Unknown mode: ${mode}`)
  if (!parseBooleanValue(readEnvironmentString('POPBILL_RUN_HTCASHBILL_EXAMPLES', 'false'), false))
    throw new Error('Set POPBILL_RUN_HTCASHBILL_EXAMPLES=true.')
  if (!parseBooleanValue(readEnvironmentString('POPBILL_IS_TEST', 'true'), true))
    throw new Error('HomeTax cashbill examples require POPBILL_IS_TEST=true.')
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
  const service = client.services.homeTaxCashbill
  const businessNumber = required('POPBILL_CORP_NUM')
  if (mode === 'request') {
    const receiptDirection = required('POPBILL_HTCASHBILL_DIRECTION')
    if (receiptDirection !== 'SELL' && receiptDirection !== 'BUY') throw new Error('POPBILL_HTCASHBILL_DIRECTION must be SELL or BUY.')
    const result = await service.requestCollection({
      businessNumber,
      receiptDirection,
      startDate: required('POPBILL_HTCASHBILL_START_DATE'),
      endDate: required('POPBILL_HTCASHBILL_END_DATE'),
    })
    console.log('JobID (valid for one hour from request):', result.jobId)
    return
  }
  const request = { businessNumber, jobId: required('POPBILL_HTCASHBILL_JOB_ID') }
  const state = await service.getCollectionJobState(request)
  console.log(state)
  if (mode === 'state') return
  if (!state.collectionSucceeded)
    throw new Error('Search requires a completed job with resultCode=1. Check state again or request a new job after failure/expiration.')
  console.log(mode === 'search' ? await service.searchCashbills({ ...request, pageSize: 100 }) : await service.getCashbillSummary(request))
}

await main()
