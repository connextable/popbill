import { createPopbillClient } from '@connextable/popbill'
import { parseBooleanValue, readEnvironmentString } from '../shared/environment.ts'

async function main(): Promise<void> {
  const mode = process.argv.slice(2).filter((argument) => argument !== '--')[0] ?? 'status'
  if (mode === '--help' || mode === '-h') {
    console.log('Usage: pnpm exec dotenvx run -- jiti ./src/lookup/run-lookup.ts [status|company|account]')
    console.log('Set POPBILL_RUN_LOOKUP_EXAMPLES=true. Queries may consume points.')
    return
  }
  if (!['status', 'company', 'account'].includes(mode)) throw new Error(`Unknown lookup mode: ${mode}`)
  if (!parseBooleanValue(readEnvironmentString('POPBILL_RUN_LOOKUP_EXAMPLES', 'false'), false))
    throw new Error('Set POPBILL_RUN_LOOKUP_EXAMPLES=true to run lookup examples.')
  if (!parseBooleanValue(readEnvironmentString('POPBILL_IS_TEST', 'true'), true)) throw new Error('Lookup examples require POPBILL_IS_TEST=true.')
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
  const businessNumber = required('POPBILL_CORP_NUM')
  if (mode === 'account') {
    console.log(
      await client.services.accountCheck.checkAccountHolderName({
        businessNumber,
        bankCode: required('POPBILL_LOOKUP_BANK_CODE'),
        accountNumber: required('POPBILL_LOOKUP_ACCOUNT_NUMBER'),
      })
    )
    return
  }
  const targetBusinessNumber = required('POPBILL_LOOKUP_TARGET_CORP_NUM')
  console.log(
    mode === 'status'
      ? await client.services.closedown.checkBusinessStatus({ businessNumber, targetBusinessNumber })
      : await client.services.bizInfoCheck.getCompanyInfo({ businessNumber, targetBusinessNumber })
  )
}

await main()
