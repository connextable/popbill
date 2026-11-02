import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { createMessageService } from '@/services/message'

interface LegacyAction {
  uri: string
  CorpNum: string
  UserID?: unknown
  Method?: string
  Data?: string
  Files?: unknown[]
}
interface LegacyInstance {
  _executeAction: (action: LegacyAction) => void
  [method: string]: unknown
}
const require = createRequire(import.meta.url)
function evaluate(source: string, resolve: (name: string) => unknown): unknown {
  const module = { exports: {} }
  vm.runInNewContext(source, { require: resolve, module, exports: module.exports, Buffer, console })
  return module.exports
}
const baseSource = readFileSync(new URL('../../../../legacy/lib/BaseService.js', import.meta.url), 'utf8')
const messageSource = readFileSync(new URL('../../../../legacy/lib/MessageService.js', import.meta.url), 'utf8')
const LegacyBase = evaluate(baseSource, (name) => (name === 'linkhub' ? { initialize() {} } : name === './Crypto/encryptor' ? {} : require(name)))
const LegacyMessage = evaluate(messageSource, (name) => (name === './BaseService' ? LegacyBase : require(name))) as new (
  config: object
) => LegacyInstance
const definitions = [
  ...messageSource.matchAll(
    /(?:MessageService\.prototype\.(\w+)\s*=\s*function\s*\(([^)]*)\)|BaseService\.addMethod\(MessageService\.prototype,\s*'(\w+)',\s*function\s*\(([^)]*)\))/g
  ),
].map((match) => ({ method: match[1] ?? match[3]!, parameters: (match[2] ?? match[4]!).split(',').map((value) => value.trim()) }))
const config = { LinkID: 'TEST', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
const values: Record<string, unknown> = {
  CorpNum: '1234567890',
  MessageType: 'SMS',
  MsgType: 'XMS',
  TOGO: 'BOX',
  UserID: 'test-user',
  SenderNumber: '07012345678',
  Sender: '07012345678',
  SenderName: '발신',
  Receiver: '01012345678',
  ReceiverName: '수신',
  Subject: '제목',
  Contents: '본문',
  reserveDT: '20261201120000',
  adsYN: true,
  requestNum: 'REQUEST-1',
  Messages: [
    {
      Sender: '07012345678',
      SenderName: '개별발신',
      Receiver: '01012345678',
      ReceiverName: '개별수신',
      Subject: '개별제목',
      Contents: '개별본문',
      interOPRefKey: 'REF-1',
    },
  ],
  FilePath: fileURLToPath(new URL('./legacy-contract.runtime.test.ts', import.meta.url)),
  ReceiptNum: '026110300000000001',
  RequestNum: 'REQUEST-1',
  ReceiveNum: '01012345678',
  SDate: '20261101',
  EDate: '20261103',
  State: ['1', '2'],
  Item: ['SMS', 'LMS'],
  ReserveYN: false,
  SenderYN: true,
  Order: 'D',
  Page: 2,
  PerPage: 10,
  QString: '받는 사람 & 회사',
  ReceiptNumList: ['026110300000000001'],
  success: () => undefined,
  error: () => undefined,
}
afterEach(() => vi.unstubAllGlobals())
describe('message legacy positional overload contracts', () => {
  // The historical 3-argument search overload always rejects its empty State.
  const callable = definitions.filter((definition) => !(definition.method === 'search' && definition.parameters.length === 5))
  it.each(callable.map((definition, index) => ({ ...definition, index })))('$index $method($parameters)', async (definition) => {
    const args = definition.parameters.map((parameter) => {
      if (!(parameter in values)) throw new Error('Missing legacy fixture: ' + parameter)
      return values[parameter]
    })
    const legacy = new LegacyMessage(config)
    let captured: LegacyAction | undefined
    legacy._executeAction = (action) => {
      captured = action
    }
    Reflect.apply(legacy[definition.method] as (...args: unknown[]) => unknown, legacy, args)
    expect(captured).toBeDefined()
    const action = captured!
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify({ session_token: 'token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' })))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 1, message: 'OK', receiptNum: 'RECEIPT', url: 'https://example.test/', unitCost: '8.00' }))
      )
    vi.stubGlobal('fetch', fetchMock)
    const service = createMessageService(config)
    await new Promise<void>((resolve, reject) =>
      Reflect.apply(Reflect.get(service, definition.method), service, [...args.slice(0, -2), () => resolve(), reject])
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [target, init] = fetchMock.mock.calls[1]!
    const actualUrl = new URL(target instanceof Request ? target.url : target)
    const expectedUrl = new URL(action.uri, 'https://example.test')
    expect(actualUrl.pathname).toBe(expectedUrl.pathname)
    expect(Object.fromEntries(actualUrl.searchParams)).toEqual(Object.fromEntries(expectedUrl.searchParams))
    expect(init?.method).toBe(action.Method ?? 'GET')
    const headers = new Headers(init?.headers)
    // Legacy's short MMS overload accidentally places a callback in UserID.
    // The new implementation keeps callbacks out of HTTP headers.
    const expectedUserId = typeof action.UserID === 'string' && action.UserID.length ? action.UserID : null
    expect(headers.get('X-PB-UserID')).toBe(expectedUserId)
    // Current HTTP docs require an object; the legacy SDK incorrectly sent a JSON string.
    // https://developers.popbill.com/api-reference/sms/api/send
    const expectedBody =
      definition.method === 'cancelReservebyRCV' || definition.method === 'cancelReserveRNbyRCV'
        ? { receiveNum: values['ReceiveNum'] }
        : action.Data === undefined
          ? undefined
          : JSON.parse(action.Data)
    const actualBody = action.Files?.length
      ? JSON.parse((await new Response(init?.body, { headers: { 'Content-Type': headers.get('Content-Type')! } }).formData()).get('form') as string)
      : init?.body === undefined
        ? undefined
        : JSON.parse(init.body as string)
    expect(actualBody).toEqual(expectedBody)
  })
})
