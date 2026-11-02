import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { createMessagePromiseService, createMessageService } from '@/services/message'
import { MESSAGE_METHODS } from '@/services/message/methods'

const corp = '1234567890'
const user = 'message-user'
const sender = '07012345678'
const receiver = '01012345678'
const ok = { code: 1, message: 'OK' }
const receipt = '026110300000000001'
const config = { LinkID: 'TEST_LINK_ID', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
const recipient = { Receiver: receiver, ReceiverName: '받는 사람', Contents: '개별 내용', Subject: '개별 제목', interOPRefKey: 'REF-1' }
function stub(response: unknown = ok, status = 200) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(JSON.stringify({ session_token: 'token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' })))
    .mockResolvedValueOnce(new Response(JSON.stringify(response), { status, headers: { 'Content-Type': 'application/json' } }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
function action(mock: ReturnType<typeof stub>) {
  expect(mock).toHaveBeenCalledTimes(2)
  const [target, init] = mock.mock.calls[1]!
  return { url: new URL(target instanceof Request ? target.url : String(target)), init: init!, headers: new Headers(init?.headers) }
}
afterEach(() => vi.unstubAllGlobals())

it('forwards recipient limits to the provider without splitting a send', async () => {
  const fetchMock = stub({ receiptNum: receipt })
  const messages = Array.from({ length: 1001 }, () => ({ Receiver: receiver }))
  await expect(createMessagePromiseService(config).sendSMS_multi(corp, sender, '내용', messages)).resolves.toBe(receipt)
  expect(JSON.parse(action(fetchMock).init.body as string).msgs).toHaveLength(1001)
})

interface Case {
  method: string
  args: unknown[]
  path: string
  verb?: string
  body?: unknown
  query?: Record<string, string>
  response?: unknown
  expected?: unknown
  hasUser?: boolean
}
const cases: Case[] = [
  { method: 'getChargeInfo', args: [corp, 'SMS', user], path: '/Message/ChargeInfo', query: { Type: 'SMS' }, hasUser: true },
  {
    method: 'getUnitCost',
    args: [corp, 'LMS'],
    path: '/Message/UnitCost',
    query: { Type: 'LMS' },
    response: { unitCost: '15.00' },
    expected: '15.00',
  },
  {
    method: 'getURL',
    args: [corp, 'BOX', user],
    path: '/Message/',
    query: { TG: 'BOX' },
    response: { url: 'https://example.test/box' },
    expected: 'https://example.test/box',
    hasUser: true,
  },
  {
    method: 'getSentListURL',
    args: [corp, user],
    path: '/Message/',
    query: { TG: 'BOX' },
    response: { url: 'https://example.test/box' },
    expected: 'https://example.test/box',
    hasUser: true,
  },
  {
    method: 'getSenderNumberMgtURL',
    args: [corp, user],
    path: '/Message/',
    query: { TG: 'SENDER' },
    response: { url: 'https://example.test/sender' },
    expected: 'https://example.test/sender',
    hasUser: true,
  },
  { method: 'checkSenderNumber', args: [corp, sender, user], path: '/Message/CheckSenderNumber/' + sender, hasUser: true },
  {
    method: 'getSenderNumberList',
    args: [corp, user],
    path: '/Message/SenderNumber',
    response: [{ number: sender, representYN: false, state: 1 }],
    hasUser: true,
  },
  { method: 'getMessages', args: [corp, 'receipt/1', user], path: '/Message/receipt%2F1', response: [], hasUser: true },
  { method: 'getMessagesRN', args: [corp, 'request/1', user], path: '/Message/Get/request%2F1', response: [], hasUser: true },
  { method: 'cancelReserve', args: [corp, receipt, user], path: '/Message/' + receipt + '/Cancel', hasUser: true },
  { method: 'cancelReserveRN', args: [corp, 'REQUEST-1', user], path: '/Message/Cancel/REQUEST-1', hasUser: true },
  {
    method: 'cancelReservebyRCV',
    args: [corp, receipt, receiver, user],
    path: '/Message/' + receipt + '/Cancel',
    verb: 'POST',
    body: { receiveNum: receiver },
    hasUser: true,
  },
  {
    method: 'cancelReserveRNbyRCV',
    args: [corp, 'REQUEST-1', receiver, user],
    path: '/Message/Cancel/REQUEST-1',
    verb: 'POST',
    body: { receiveNum: receiver },
    hasUser: true,
  },
  { method: 'getAutoDenyList', args: [corp, user], path: '/Message/Denied', response: [], hasUser: true },
  {
    method: 'checkAutoDenyNumber',
    args: [corp, user],
    path: '/Message/AutoDenyNumberInfo',
    response: { smsdenyNumber: '08012345678' },
    hasUser: true,
  },
  {
    method: 'getStates',
    args: [corp, [receipt], user],
    path: '/Message/States',
    verb: 'POST',
    body: [receipt],
    response: [{ receiptNum: receipt, state: '1' }],
    hasUser: true,
  },
  {
    method: 'search',
    args: [corp, '20261101', '20261103', ['1', '2'], ['SMS', 'MMS'], false, true, 'D', 2, 10, '받는 & 사람', user],
    path: '/Message/Search',
    query: {
      SDate: '20261101',
      EDate: '20261103',
      State: '1,2',
      Item: 'SMS,MMS',
      ReserveYN: '0',
      SenderOnly: '1',
      Order: 'D',
      Page: '2',
      PerPage: '10',
      QString: '받는 & 사람',
    },
    response: { ...ok, total: 0, perPage: 10, pageNum: 2, pageCount: 0, list: [] },
    hasUser: true,
  },
]
describe('MessageService HTTP contracts', () => {
  it.each(cases)('$method forwards its own contract', async (testCase) => {
    const mock = stub(testCase.response ?? ok)
    const service = createMessagePromiseService(config)
    const result = await Reflect.apply(Reflect.get(service, testCase.method), service, testCase.args)
    expect(result).toEqual(testCase.expected ?? testCase.response ?? ok)
    const { url, init, headers } = action(mock)
    expect(url.pathname).toBe(testCase.path)
    expect(Object.fromEntries(url.searchParams)).toEqual(testCase.query ?? {})
    expect(init.method).toBe(testCase.verb ?? 'GET')
    expect(headers.get('X-PB-UserID')).toBe(testCase.hasUser ? user : null)
    expect(init.body === undefined ? undefined : JSON.parse(init.body as string)).toEqual(testCase.body)
  })
  it.each(['SMS', 'LMS', 'XMS'] as const)('preserves %s single and batch positional contracts', async (type) => {
    const service = createMessagePromiseService(config)
    let mock = stub({ receiptNum: receipt })
    const single = Reflect.get(service, 'send' + type)
    const args = [
      corp,
      sender,
      receiver,
      '받는 사람',
      ...(type === 'SMS' ? [] : ['제목']),
      '본문',
      '20261201120000',
      true,
      '보내는 사람',
      'REQUEST',
      user,
    ]
    expect(await Reflect.apply(single, service, args)).toBe(receipt)
    let request = action(mock)
    expect(request.url.pathname).toBe('/' + type)
    expect(JSON.parse(request.init.body as string)).toEqual({
      msgs: [{ snd: sender, sndnm: '보내는 사람', rcv: receiver, rcvnm: '받는 사람', ...(type === 'SMS' ? {} : { sjt: '제목' }), msg: '본문' }],
      sndDT: '20261201120000',
      adsYN: true,
      requestNum: 'REQUEST',
    })
    // Each factory owns token state; do not reuse an authenticated instance with a fresh mock.
    const batchService = createMessagePromiseService(config)
    mock = stub({ receiptNum: receipt })
    expect(
      await Reflect.apply(Reflect.get(batchService, 'send' + type + '_multi'), batchService, [
        corp,
        sender,
        ...(type === 'SMS' ? [] : ['공통 제목']),
        '공통 본문',
        [recipient],
        '',
        false,
        'BATCH',
        '보내는 사람',
        user,
      ])
    ).toBe(receipt)
    request = action(mock)
    expect(request.headers.get('X-PB-UserID')).toBe(user)
    expect(JSON.parse(request.init.body as string)).toEqual({
      snd: sender,
      sndnm: '보내는 사람',
      ...(type === 'SMS' ? {} : { subject: '공통 제목' }),
      content: '공통 본문',
      msgs: [{ rcv: receiver, rcvnm: '받는 사람', msg: '개별 내용', sjt: '개별 제목', interOPRefKey: 'REF-1' }],
      adsYN: false,
      requestNum: 'BATCH',
    })
  })
  it('supports generic sends and current Content field without mutating recipients', async () => {
    const mock = stub({ receiptNum: receipt })
    const message = Object.freeze({ Receiver: receiver, Content: '문서 이름', interOPRefKey: 'REF' })
    expect(
      await createMessagePromiseService(config).sendMessage('XMS', corp, sender, '발신', '제목', '내용', message, undefined, false, undefined, user)
    ).toBe(receipt)
    expect(JSON.parse(action(mock).init.body as string).msgs).toEqual([{ rcv: receiver, msg: '문서 이름', interOPRefKey: 'REF' }])
    const auth = JSON.parse(mock.mock.calls[0]?.[1]?.body as string)
    expect(auth.scope).toEqual(expect.arrayContaining(['member', '150', '151', '152']))
  })
  it.each(['sendMMS', 'sendMMS_multi', 'sendMessage_MMS', 'sendMMSBinary', 'sendMMSBinary_multi'])(
    '%s uses the MMS file field and receipt extraction',
    async (method) => {
      const mock = stub({ receiptNum: receipt })
      const filePath = fileURLToPath(new URL('./protocol.runtime.test.ts', import.meta.url))
      const bytes = await readFile(filePath)
      const file = method.includes('Binary') ? { fileName: '사진"\r\n.jpg', fileData: bytes } : filePath
      const service = createMessagePromiseService(config)
      const args =
        method === 'sendMessage_MMS'
          ? [corp, sender, '발신', '제목', '본문', [recipient], file, '', false, 'MMS-1', user]
          : method.endsWith('_multi')
            ? [corp, sender, '제목', '본문', [recipient], file, '', false, 'MMS-1', '발신', user]
            : [corp, sender, receiver, '수신', '제목', '본문', file, '', false, 'MMS-1', '발신', user]
      expect(await Reflect.apply(Reflect.get(service, method), service, args)).toBe(receipt)
      const { url, init, headers } = action(mock)
      expect(url.pathname).toBe('/MMS')
      expect(init.method).toBe('POST')
      expect(headers.get('X-PB-UserID')).toBe(user)
      const form = await new Response(init.body, { headers: { 'Content-Type': headers.get('Content-Type')! } }).formData()
      expect(form.get('file')).toBeInstanceOf(File)
      expect(Buffer.from(await (form.get('file') as File).arrayBuffer())).toEqual(bytes)
      const json = JSON.parse(form.get('form') as string)
      expect(json.requestNum).toBe('MMS-1')
      expect(json.adsYN).toBe(false)
      const encodedName = method.includes('Binary') ? '사진%22%0D%0A.jpg' : 'protocol.runtime.test.ts'
      const decodedName = method.includes('Binary') ? '사진"\r\n.jpg' : 'protocol.runtime.test.ts'
      expect(Buffer.from(init.body as Uint8Array).toString()).toContain('filename="' + encodedName + '"')
      expect((form.get('file') as File).name).toBe(decodedName)
    }
  )
  it('covers every declared method', () => {
    expect(
      new Set([
        ...cases.map((c) => c.method),
        'sendMessage',
        'sendSMS',
        'sendSMS_multi',
        'sendLMS',
        'sendLMS_multi',
        'sendXMS',
        'sendXMS_multi',
        'sendMMS',
        'sendMMS_multi',
        'sendMessage_MMS',
        'sendMMSBinary',
        'sendMMSBinary_multi',
      ])
    ).toEqual(new Set(MESSAGE_METHODS))
  })
})

describe('MessageService failure and callback boundaries', () => {
  it('accepts the shortest send callback overload', async () => {
    stub({ receiptNum: receipt })
    await new Promise<void>((resolve, reject) =>
      createMessageService(config).sendSMS(
        corp,
        sender,
        receiver,
        '',
        '본문',
        '',
        (value) => {
          expect(value).toBe(receipt)
          resolve()
        },
        reject
      )
    )
  })
  it('isolates user success callback exceptions', async () => {
    stub(ok)
    const error = vi.fn<(error: unknown) => void>()
    await new Promise<void>((resolve) =>
      createMessageService(config).checkSenderNumber(
        corp,
        sender,
        () => {
          resolve()
          throw new Error('callback')
        },
        error
      )
    )
    expect(error).not.toHaveBeenCalled()
  })
  it('supports an undefined user ID with both callback slots', async () => {
    stub([{ number: sender }])
    await new Promise<void>((resolve) =>
      createMessageService(config).getSenderNumberList(
        corp,
        undefined,
        (value) => {
          expect(value).toEqual([{ number: sender }])
          resolve()
        },
        undefined
      )
    )
  })
  it('normalizes promise and error-only callback failures without replacing them with handler failures', async () => {
    const onError = vi.fn<() => void>(() => {
      throw new Error('handler')
    })
    stub({ code: -10000001, message: '실패' }, 400)
    await expect(createMessagePromiseService({ ...config, defaultErrorHandler: onError }).getSenderNumberList(corp)).rejects.toMatchObject({
      code: -10000001,
      message: '실패',
    })
    expect(onError).toHaveBeenCalledTimes(1)
    stub({ code: -10000001, message: '실패' }, 400)
    await new Promise<void>((resolve) =>
      createMessageService(config).getSenderNumberList(corp, undefined, (error) => {
        expect(error).toMatchObject({ code: -10000001 })
        resolve()
      })
    )
  })
  it('rejects invalid dates, state filters, types, files, and required identifiers before dispatch', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    const service = createMessagePromiseService(config)
    await expect(service.search(corp, '2026-11-01', '20261103', ['1'])).rejects.toMatchObject({ code: -99999999 })
    await expect(service.search(corp, '20261101', '20261103', [])).rejects.toHaveProperty('code')
    await expect(service.getUnitCost(corp, 'XMS' as 'SMS')).rejects.toHaveProperty('code')
    await expect(service.cancelReservebyRCV(corp, receipt, '')).rejects.toHaveProperty('code')
    await expect(service.sendMMS(corp, sender, receiver, '', '', '내용', 12 as unknown as string)).rejects.toHaveProperty('code')
    await expect(
      service.sendMMSBinary(corp, sender, receiver, '', '', '내용', { fileName: 'a.jpg', fileData: 'bad' as unknown as Buffer })
    ).rejects.toHaveProperty('code')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
