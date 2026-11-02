import { createPopbillClient } from '@connextable/popbill'
import { parseBooleanValue, readEnvironmentString } from '../shared/environment.ts'

async function main(): Promise<void> {
  const mode = process.argv.slice(2).filter((argument) => argument !== '--')[0] ?? 'state'
  if (mode === '--help' || mode === '-h') {
    console.log('Usage: pnpm exec dotenvx run -- jiti ./src/home-tax-tax-invoice/collection.ts [request|state|search|summary]')
    console.log(
      'Set POPBILL_RUN_HTTAXINVOICE_EXAMPLES=true and POPBILL_IS_TEST=true. Existing HomeTax authentication and a flat-rate contract are required.'
    )
    console.log('request: POPBILL_HTTAXINVOICE_DIRECTION=SELL|BUY|TRUSTEE, POPBILL_HTTAXINVOICE_START_DATE/END_DATE=yyyyMMdd.')
    console.log(
      'Other modes: POPBILL_HTTAXINVOICE_JOB_ID. Job IDs expire one hour after the original request; request a new job explicitly after expiration.'
    )
    return
  }
  if (!['request', 'state', 'search', 'summary'].includes(mode)) throw new Error(`Unknown mode: ${mode}`)
  if (!parseBooleanValue(readEnvironmentString('POPBILL_RUN_HTTAXINVOICE_EXAMPLES', 'false'), false))
    throw new Error('Set POPBILL_RUN_HTTAXINVOICE_EXAMPLES=true.')
  if (!parseBooleanValue(readEnvironmentString('POPBILL_IS_TEST', 'true'), true))
    throw new Error('HomeTax tax invoice examples require POPBILL_IS_TEST=true.')
  const required = (name: string): string => {
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
  const service = client.services.homeTaxTaxInvoice
  const businessNumber = required('POPBILL_CORP_NUM')
  if (mode === 'request') {
    const invoiceDirection = required('POPBILL_HTTAXINVOICE_DIRECTION')
    if (invoiceDirection !== 'SELL' && invoiceDirection !== 'BUY' && invoiceDirection !== 'TRUSTEE')
      throw new Error('POPBILL_HTTAXINVOICE_DIRECTION must be SELL, BUY, or TRUSTEE.')
    const receipt = await service.requestCollection({
      businessNumber,
      invoiceDirection,
      searchDateType: 'S',
      startDate: required('POPBILL_HTTAXINVOICE_START_DATE'),
      endDate: required('POPBILL_HTTAXINVOICE_END_DATE'),
    })
    console.log('JobID (valid for one hour from this request):', receipt.jobId)
    return
  }
  const request = { businessNumber, jobId: required('POPBILL_HTTAXINVOICE_JOB_ID') }
  const state = await service.getCollectionState(request)
  console.log(state)
  if (mode === 'state') return
  if (!state.isSearchable)
    throw new Error(
      'Search requires stateCode=3 and resultCode=1. Check a pending job again; resolve failed authentication or request a new job after expiration.'
    )
  console.log(mode === 'search' ? await service.searchTaxInvoices({ ...request, pageSize: 100 }) : await service.getTaxInvoiceTotals(request))
}

await main()
