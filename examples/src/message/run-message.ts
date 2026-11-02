import { createPopbillClient } from '@connextable/popbill'

/** Read-only by default. Set POPBILL_RUN_MESSAGE_SEND=true to send one test SMS. */
export async function runMessageExample(send = false) {
  const client = createPopbillClient({
    linkId: process.env.POPBILL_LINK_ID ?? '',
    secretKey: process.env.POPBILL_SECRET_KEY ?? '',
    userId: process.env.POPBILL_USER_ID ?? '',
    isTest: true,
  })
  const service = client.services.message
  const businessNumber = process.env.POPBILL_CORP_NUM ?? ''
  const senderNumber = process.env.POPBILL_MESSAGE_SENDER_NUMBER ?? ''
  const senders = await service.getSenderNumbers({ businessNumber })
  if (!send) return { senders }
  const receiverNumber = process.env.POPBILL_MESSAGE_RECEIVER_NUMBER ?? ''
  if (!senderNumber || !receiverNumber) throw new Error('Set POPBILL_MESSAGE_SENDER_NUMBER and POPBILL_MESSAGE_RECEIVER_NUMBER.')
  const requestNumber = 'EXAMPLE-' + Date.now()
  // Persist this value before sending when recovery across process restarts is required.
  console.log({ requestNumber })
  const receipt = await service.sendShortMessage({
    businessNumber,
    senderNumber,
    body: '문자 SDK 테스트',
    recipients: [{ receiverNumber }],
    requestNumber,
  })
  return { senders, receipt, messages: await service.getMessagesByRequestNumber({ businessNumber, requestNumber }) }
}

const mode = process.argv.slice(2).filter((argument) => argument !== '--')[0] ?? 'senders'
if (mode === '--help' || mode === '-h') {
  console.log('Usage from examples/: pnpm exec dotenvx run -- jiti src/message/run-message.ts [senders|send]')
  console.log('Set POPBILL_RUN_MESSAGE_EXAMPLES=true and POPBILL_IS_TEST=true.')
  console.log('Sending additionally requires POPBILL_RUN_MESSAGE_SEND=true and sender/receiver numbers.')
} else {
  if (!['senders', 'send'].includes(mode)) throw new Error('Unknown message mode: ' + mode)
  if (process.env.POPBILL_RUN_MESSAGE_EXAMPLES !== 'true') throw new Error('Set POPBILL_RUN_MESSAGE_EXAMPLES=true.')
  if (process.env.POPBILL_IS_TEST !== 'true') throw new Error('Message examples require POPBILL_IS_TEST=true.')
  if (mode === 'send' && process.env.POPBILL_RUN_MESSAGE_SEND !== 'true') throw new Error('Set POPBILL_RUN_MESSAGE_SEND=true.')
  console.log(await runMessageExample(mode === 'send'))
}
