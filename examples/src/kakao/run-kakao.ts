import { createPopbillClient } from '@connextable/popbill'
import { pathToFileURL } from 'node:url'

/** Set POPBILL_RUN_KAKAO_EXAMPLES=true for read-only sandbox calls. */
export async function runKakaoExample(mode: 'list' | 'send' = 'list') {
  if (process.env.POPBILL_RUN_KAKAO_EXAMPLES !== 'true') throw new Error('Set POPBILL_RUN_KAKAO_EXAMPLES=true.')
  if (mode === 'send' && process.env.POPBILL_RUN_KAKAO_SEND !== 'true') throw new Error('Set POPBILL_RUN_KAKAO_SEND=true for the send mode.')
  const businessNumber = process.env.POPBILL_CORP_NUM ?? ''
  const client = createPopbillClient({
    linkId: process.env.POPBILL_LINK_ID ?? '',
    secretKey: process.env.POPBILL_SECRET_KEY ?? '',
    userId: process.env.POPBILL_USER_ID ?? '',
    isTest: true,
  })
  const service = client.services.kakao
  const channels = await service.listBusinessChannels({ businessNumber })
  const templates = await service.listNotificationTemplates({ businessNumber })
  if (mode === 'list') return { channels, templates }

  const templateCode = process.env.POPBILL_KAKAO_TEMPLATE_CODE ?? ''
  const receiverPhoneNumber = process.env.POPBILL_KAKAO_RECEIVER_NUMBER ?? ''
  const messageBody = process.env.POPBILL_KAKAO_MESSAGE_BODY ?? ''
  if (!templateCode || !receiverPhoneNumber || !messageBody)
    throw new Error('Set POPBILL_KAKAO_TEMPLATE_CODE, POPBILL_KAKAO_RECEIVER_NUMBER, and POPBILL_KAKAO_MESSAGE_BODY.')
  const requestNumber = 'KAKAO-EXAMPLE-' + Date.now()
  // Persist requestNumber before the request to recover a lost send response.
  console.log({ requestNumber })
  const receipt = await service.sendNotificationMessage({ businessNumber, templateCode, receiverPhoneNumber, messageBody, requestNumber })
  return { channels, templates, receipt, messages: await service.getMessagesByRequestNumber({ businessNumber, requestNumber }) }
}

async function main(): Promise<void> {
  const mode = process.argv.slice(2).find((argument) => argument !== '--') ?? 'list'
  if (mode === '--help' || mode === '-h') {
    console.log('Usage: pnpm -C examples kakao -- [list|send]')
    console.log('Sandbox only. Set POPBILL_RUN_KAKAO_EXAMPLES=true for list; sending also needs POPBILL_RUN_KAKAO_SEND=true.')
    return
  }
  if (mode !== 'list' && mode !== 'send') throw new Error('Expected list or send mode.')
  console.log(await runKakaoExample(mode))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
