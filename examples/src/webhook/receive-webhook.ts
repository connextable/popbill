import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve, join } from 'node:path'
import { createPopbillWebhookReceiver, PopbillWebhookError, type PopbillWebhookMessage } from '@connextable/popbill/webhook'
import { parsePositiveIntegerValue, readEnvironmentString } from '../shared/environment.ts'

if (process.argv.includes('--help')) {
  console.log('POPBILL_WEBHOOK_API_KEY=<configured-key> pnpm -C examples webhook')
  console.log('POST /webhook/popbill; localhost port POPBILL_WEBHOOK_PORT (default 9854).')
  console.log('Accepted deliveries are saved in POPBILL_WEBHOOK_INBOX_DIR (default .temp/webhook-inbox).')
  process.exit(0)
}

const receiver = createPopbillWebhookReceiver({ authentication: { type: 'apiKey', apiKey: process.env['POPBILL_WEBHOOK_API_KEY']! } })
const port = parsePositiveIntegerValue(readEnvironmentString('POPBILL_WEBHOOK_PORT', '9854'), 9854)
const inboxDirectory = resolve(readEnvironmentString('POPBILL_WEBHOOK_INBOX_DIR', '.temp/webhook-inbox'))
const maxBodyBytes = parsePositiveIntegerValue(readEnvironmentString('POPBILL_WEBHOOK_MAX_BYTES', '1048576'), 1048576)
await mkdir(inboxDirectory, { recursive: true })

/** Local demonstration inbox. Production applications should use a transactional database/queue. */
async function acceptDelivery(message: PopbillWebhookMessage): Promise<void> {
  const id = createHash('sha256')
    .update(JSON.stringify([message.businessNumber, message.messageId]))
    .digest('hex')
  const file = join(inboxDirectory, `${id}.json`)
  const content = JSON.stringify(message)
  try {
    await writeFile(file, content, { flag: 'wx', flush: true })
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'EEXIST') throw error
    if ((await readFile(file, 'utf-8')) !== content) throw new Error('Stored delivery differs; inspect the inbox before retrying.')
  }
}

const server = createServer(async (request, response) => {
  if (request.url !== '/webhook/popbill') {
    response.writeHead(404).end()
    return
  }
  if (request.method !== 'POST') {
    response.writeHead(405, { Allow: 'POST' }).end()
    return
  }
  try {
    const chunks: Uint8Array[] = []
    let length = 0
    for await (const chunk of request as AsyncIterable<Uint8Array>) {
      length += chunk.byteLength
      if (length > maxBodyBytes) {
        response.writeHead(413).end()
        return
      }
      chunks.push(chunk)
    }
    const message = receiver.parse({ headers: request.headers, body: Buffer.concat(chunks) })
    await acceptDelivery(message)
    const acknowledgement = receiver.createSuccessResponse()
    response.writeHead(acknowledgement.status, acknowledgement.headers).end(acknowledgement.body)
    console.log('Accepted webhook', { messageId: message.messageId, eventCount: message.events.length })
  } catch (error) {
    const status = error instanceof PopbillWebhookError ? (error.code === 'AUTHENTICATION_FAILED' ? 401 : 400) : 503
    response.writeHead(status).end()
    console.error('Webhook rejected', error instanceof PopbillWebhookError ? error.code : 'INBOX_UNAVAILABLE')
  }
})
server.listen(port, '127.0.0.1', () => console.log(`Webhook receiver: http://127.0.0.1:${port}/webhook/popbill`))
