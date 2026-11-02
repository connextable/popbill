import { createPopbillClient } from '@connextable/popbill'
import { parseBooleanValue, readEnvironmentString } from '../shared/environment.ts'

async function main(): Promise<void> {
  const mode = process.argv.slice(2).filter((argument) => argument !== '--')[0] ?? 'status'
  if (mode === '--help' || mode === '-h') {
    console.log('Usage: pnpm -C examples fax -- [status|send|cancel]')
    console.log('Set POPBILL_RUN_FAX_EXAMPLES=true. Sending also requires POPBILL_ALLOW_FAX_SEND=true.')
    return
  }
  if (!['status', 'send', 'cancel'].includes(mode)) throw new Error(`Unknown fax scenario: ${mode}`)
  if (!parseBooleanValue(readEnvironmentString('POPBILL_RUN_FAX_EXAMPLES', 'false'), false)) throw new Error('Set POPBILL_RUN_FAX_EXAMPLES=true.')
  if (!parseBooleanValue(readEnvironmentString('POPBILL_IS_TEST', 'true'), true)) throw new Error('Fax examples require POPBILL_IS_TEST=true.')
  const required = (name: string): string => {
    const value = readEnvironmentString(name, '')
    if (!value) throw new Error(`Missing environment variable: ${name}`)
    return value
  }
  const service = createPopbillClient({
    linkId: required('POPBILL_LINK_ID'),
    secretKey: required('POPBILL_SECRET_KEY'),
    userId: required('POPBILL_USER_ID'),
    isTest: true,
  }).services.fax
  const businessNumber = required('POPBILL_CORP_NUM')
  const requestNumber = required('POPBILL_FAX_REQUEST_NUMBER')
  if (mode === 'status') {
    console.log(await service.getFaxResultsByRequest({ businessNumber, requestNumber }))
    return
  }
  if (mode === 'cancel') {
    console.log(await service.cancelScheduledFaxByRequest({ businessNumber, requestNumber }))
    return
  }
  if (!parseBooleanValue(readEnvironmentString('POPBILL_ALLOW_FAX_SEND', 'false'), false))
    throw new Error('Set POPBILL_ALLOW_FAX_SEND=true before sending. Sandbox fax transmission can reach real recipients.')
  // Keep the request number: query status after an uncertain response before retrying.
  console.log('Sending request number:', requestNumber)
  console.log(
    await service.sendFaxFromPaths({
      businessNumber,
      requestNumber,
      senderPhoneNumber: required('POPBILL_FAX_SENDER_NUMBER'),
      recipients: [{ phoneNumber: required('POPBILL_FAX_RECIPIENT_NUMBER') }],
      filePaths: [required('POPBILL_FAX_FILE_PATH')],
      scheduledAt: readEnvironmentString('POPBILL_FAX_SCHEDULED_AT', '') || undefined,
    })
  )
}

await main()
