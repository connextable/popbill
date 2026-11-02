import { createPopbillClient } from '@connextable/popbill'
import { parseBooleanValue, readEnvironmentString } from '../shared/environment.ts'

async function main(): Promise<void> {
  const mode = process.argv.slice(2).filter((argument) => argument !== '--')[0] ?? 'lookup'
  if (mode === '--help' || mode === '-h') {
    console.log('Usage: pnpm -C examples cashbill -- [lookup|bulk-result]')
    console.log('Requires POPBILL_RUN_CASHBILL_EXAMPLES=true and POPBILL_IS_TEST=true.')
    return
  }
  if (!['lookup', 'bulk-result'].includes(mode)) throw new Error(`Unknown cashbill scenario: ${mode}`)
  if (!parseBooleanValue(readEnvironmentString('POPBILL_RUN_CASHBILL_EXAMPLES', 'false'), false))
    throw new Error('Set POPBILL_RUN_CASHBILL_EXAMPLES=true.')
  if (!parseBooleanValue(readEnvironmentString('POPBILL_IS_TEST', 'true'), true)) throw new Error('Cashbill examples require POPBILL_IS_TEST=true.')
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
  const service = client.services.cashbill
  const businessNumber = required('POPBILL_CORP_NUM')
  if (mode === 'bulk-result') {
    const result = await service.getCashbillBulkResult({ businessNumber, submissionIdentifier: required('POPBILL_CASHBILL_SUBMIT_ID') })
    console.log(JSON.stringify(result, null, 2))
    return
  }
  const key = { businessNumber, managementKey: required('POPBILL_CASHBILL_MGT_KEY') }
  const usage = await service.checkCashbillManagementKeyInUse(key)
  if (!usage.isInUse) throw new Error('The supplied cashbill management key does not exist.')
  console.log(JSON.stringify(await service.getCashbillInfo(key), null, 2))
  console.log(JSON.stringify(await service.getCashbillDetailInfo(key), null, 2))
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
