import { fileURLToPath } from 'node:url'
import { createFaxPromiseService, createFaxService } from '@/services/fax'
import { FAX_METHODS } from '@/services/fax/methods'
import type { CompatConfig } from '@/config'

const CORP = '1234567890'
const USER = 'fax-user'
const config = (defaultErrorHandler?: (error: unknown) => void): CompatConfig => ({
  LinkID: 'TEST',
  SecretKey: Buffer.from('secret').toString('base64'),
  IsTest: true,
  defaultErrorHandler,
})
const ok = { code: 1, message: '성공' }
const receipt = { receiptNum: '026110312000000001' }
const access = { url: 'https://example.test/fax' }
const result = { state: 3, result: 0, receiveNum: '0212345678', requestNum: 'REQ-1' }
const files = [{ fileName: 'sample.txt', fileData: Buffer.from('fax bytes') }]
const sourcePath = fileURLToPath(new URL('../../README.md', import.meta.url))

function stub(body: unknown, status = 200) {
  const json = (value: unknown, code = 200) => new Response(JSON.stringify(value), { status: code, headers: { 'Content-Type': 'application/json' } })
  const mock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(json({ session_token: 'fax-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
    .mockResolvedValueOnce(json(body, status))
  vi.stubGlobal('fetch', mock)
  return mock
}
function invoke(service: object, method: string, args: unknown[]): unknown {
  const fn: unknown = Reflect.get(service, method)
  if (typeof fn !== 'function') throw new Error(`Missing FaxService.${method}`)
  return Reflect.apply(fn, service, args)
}
function request(mock: ReturnType<typeof stub>) {
  expect(mock).toHaveBeenCalledTimes(2)
  const target = mock.mock.calls[1]![0]
  return { url: new URL(target instanceof Request ? target.url : target), init: mock.mock.calls[1]![1] as RequestInit }
}
interface Case {
  method: string
  args: unknown[]
  path: string
  query?: Record<string, string>
  body?: unknown
  methodType?: string
  response: unknown
  expected?: unknown
  options?: boolean
  multipart?: boolean
}
async function readMultipart(init: RequestInit) {
  const form = await new Response(init.body, { headers: { 'Content-Type': (init.headers as Record<string, string>)['Content-Type']! } }).formData()
  return { fileCount: form.getAll('file').length, form: JSON.parse(form.get('form') as string) as unknown }
}
const cases: Case[] = [
  {
    method: 'getChargeInfo',
    args: ['지능'],
    path: '/FAX/ChargeInfo',
    query: { receiveNumType: '지능' },
    response: { unitCost: '100', chargeMethod: '연동', rateSystem: '종량제' },
  },
  { method: 'getUnitCost', args: ['일반'], path: '/FAX/UnitCost', query: { receiveNumType: '일반' }, response: { unitCost: '50' }, expected: '50' },
  { method: 'checkSenderNumber', args: ['02/1?2'], path: '/FAX/CheckSenderNumber/02%2F1%3F2', response: ok },
  {
    method: 'sendFax',
    args: [{ SenderNum: '0211111111', Receiver: '0222222222', ReceiverName: '수신자', FilePaths: [sourcePath], UserID: USER }],
    path: '/FAX',
    response: receipt,
    expected: receipt.receiptNum,
    methodType: 'POST',
    options: true,
    multipart: true,
  },
  {
    method: 'sendFaxBinary',
    args: [
      {
        SenderNum: '0211111111',
        Receiver: [{ receiveNum: '0222222222', receiveName: '수신자', interOPRefKey: 'ROW-1' }],
        BinaryFiles: files,
        UserID: USER,
      },
    ],
    path: '/FAX',
    response: receipt,
    expected: receipt.receiptNum,
    methodType: 'POST',
    options: true,
    multipart: true,
  },
  {
    method: 'resendFax',
    args: [
      {
        ReceiptNum: 'R/1?',
        SenderNum: '0211111111',
        Receiver: { receiveNum: '0222222222', receiveName: '변경수신자' },
        ReserveDT: '20261201120000',
        UserID: USER,
      },
    ],
    path: '/FAX/R%2F1%3F',
    body: { snd: '0211111111', rcvs: [{ rcv: '0222222222', rcvnm: '변경수신자' }], sndDT: '20261201120000' },
    methodType: 'POST',
    response: receipt,
    expected: receipt.receiptNum,
    options: true,
  },
  {
    method: 'resendFaxRN',
    args: [{ OrgRequestNum: 'REQ/1?', RequestNum: 'REQ-2', UserID: USER }],
    path: '/FAX/Resend/REQ%2F1%3F',
    body: { requestNum: 'REQ-2' },
    methodType: 'POST',
    response: receipt,
    expected: receipt.receiptNum,
    options: true,
  },
  { method: 'getFaxResult', args: ['R/1?'], path: '/FAX/R%2F1%3F', response: [result] },
  { method: 'getFaxResultRN', args: ['REQ/1?'], path: '/FAX/Get/REQ%2F1%3F', response: [result] },
  { method: 'getURL', args: ['BOX'], path: '/FAX/', query: { TG: 'BOX' }, response: access, expected: access.url },
  { method: 'getSentListURL', args: [], path: '/FAX/', query: { TG: 'BOX' }, response: access, expected: access.url },
  { method: 'getSenderNumberMgtURL', args: [], path: '/FAX/', query: { TG: 'SENDER' }, response: access, expected: access.url },
  { method: 'cancelReserve', args: ['R/1?'], path: '/FAX/R%2F1%3F/Cancel', response: ok },
  { method: 'cancelReserveRN', args: ['REQ/1?'], path: '/FAX/Cancel/REQ%2F1%3F', response: ok },
  {
    method: 'search',
    args: ['20261101', '20261103', ['1', '4'], false, false, 'D', 2, 10, '회사 & 담당자'],
    path: '/FAX/Search',
    query: {
      SDate: '20261101',
      EDate: '20261103',
      State: '1,4',
      ReserveYN: '0',
      SenderOnly: '0',
      Order: 'D',
      Page: '2',
      PerPage: '10',
      QString: '회사 & 담당자',
    },
    response: { ...ok, total: 1, pageNum: 2, perPage: 10, pageCount: 1, list: [result] },
  },
  {
    method: 'getSenderNumberList',
    args: [],
    path: '/FAX/SenderNumber',
    response: [{ number: '0212345678', representYN: false, state: 1, memo: null }],
  },
  { method: 'getPreviewURL', args: ['R/1?'], path: '/FAX/Preview/R%2F1%3F', response: access, expected: access.url },
]

describe('fax wire contracts', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
  test('covers all 17 legacy APIs', () => {
    expect(cases.map((entry) => entry.method).sort()).toEqual([...FAX_METHODS].sort())
  })
  describe.each(['callback', 'promise'] as const)('%s', (style) => {
    test.each(cases)('$method uses provider path, headers and result', async (entry) => {
      const mock = stub(entry.response)
      const service = style === 'callback' ? createFaxService(config()) : createFaxPromiseService(config())
      const args = [CORP, ...entry.args, ...(entry.options ? [] : [USER])]
      const value =
        style === 'promise'
          ? await invoke(service, entry.method, args)
          : await new Promise((resolve, reject) => invoke(service, entry.method, [...args, resolve, reject]))
      expect(value).toEqual(entry.expected ?? entry.response)
      const { url, init } = request(mock)
      expect(url.pathname).toBe(entry.path)
      expect(Object.fromEntries(url.searchParams)).toEqual(entry.query ?? {})
      expect(init.method).toBe(entry.methodType ?? 'GET')
      const headers = init.headers as Record<string, string>
      expect(headers['x-pb-userid']).toBe(USER)
      expect(headers['Authorization']).toBe('Bearer fax-token')
      const actualBody = entry.multipart ? await readMultipart(init) : init.body === undefined ? undefined : JSON.parse(init.body as string)
      const expectedMultipart = {
        fileCount: 1,
        form: expect.objectContaining({ snd: '0211111111', fCnt: 1, rcvs: [expect.objectContaining({ rcv: '0222222222', rcvnm: '수신자' })] }),
      }
      const expectedBody = entry.multipart ? expectedMultipart : entry.body
      expect(actualBody).toEqual(expectedBody)
    })
  })
  test('requests member, normal and intelligent fax scopes', async () => {
    const mock = stub([result])
    await createFaxPromiseService(config()).getFaxResult(CORP, receipt.receiptNum)
    expect(JSON.parse(mock.mock.calls[0]![1]!.body as string)).toMatchObject({ access_id: CORP, scope: ['member', '160', '161'] })
  })
  test.each(['getChargeInfo', 'getUnitCost'])('%s defaults receive number type', async (method) => {
    const mock = stub({ unitCost: '50' })
    await invoke(createFaxPromiseService(config()), method, [CORP])
    expect(request(mock).url.searchParams.get('receiveNumType')).toBe('일반')
  })
  test('null receive number type uses the legacy normal-network default', async () => {
    const mock = stub({ unitCost: '50' })
    await createFaxPromiseService(config()).getUnitCost(CORP, null)
    expect(request(mock).url.searchParams.get('receiveNumType')).toBe('일반')
  })
  test('missing local files reject before authentication or fax submission', async () => {
    const mock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', mock)
    await expect(
      createFaxPromiseService(config()).sendFax(CORP, {
        SenderNum: '0211111111',
        Receiver: '0222222222',
        FilePaths: '/nonexistent-popbill-fax-fixture/absent.pdf',
      })
    ).rejects.toBeInstanceOf(Error)
    expect(mock).not.toHaveBeenCalled()
  })
  test('binary files use file parts and exact bytes, with escaped names and false advertisement flag', async () => {
    const mock = stub(receipt)
    const bytes = Buffer.from([0, 255, 13, 10, 128])
    await createFaxPromiseService(config()).sendFaxBinary(CORP, {
      SenderNum: '0211111111',
      Receiver: { receiveNum: '0222222222', receiveName: '고객' },
      BinaryFiles: [
        { fileName: 'quo"te\r\n.pdf', fileData: bytes },
        { fileName: 'second.pdf', fileData: Buffer.from('second') },
      ],
      AdsYN: false,
    })
    const { init } = request(mock)
    const body = Buffer.from(init.body as Uint8Array)
    expect(body.toString()).toContain('filename="quo%22te%0D%0A.pdf"')
    expect(body.includes(bytes)).toBe(true)
    const form = await new Response(init.body, { headers: { 'Content-Type': (init.headers as Record<string, string>)['Content-Type']! } }).formData()
    expect(form.getAll('file')).toHaveLength(2)
    expect(JSON.parse(form.get('form') as string)).toMatchObject({ fCnt: 2, adsYN: false, rcvs: [{ rcv: '0222222222', rcvnm: '고객' }] })
  })
  test('single file path is one file, not a character array', async () => {
    const mock = stub(receipt)
    await createFaxPromiseService(config()).sendFax(CORP, { SenderNum: '0211111111', Receiver: '0222222222', FilePaths: sourcePath })
    const { init } = request(mock)
    const form = await new Response(init.body, { headers: { 'Content-Type': (init.headers as Record<string, string>)['Content-Type']! } }).formData()
    expect(form.getAll('file')).toHaveLength(1)
    expect(JSON.parse(form.get('form') as string)).toMatchObject({ fCnt: 1 })
  })
  test('forwards recipient limits to the provider without splitting a fax send', async () => {
    const mock = stub(receipt)
    await expect(
      createFaxPromiseService(config()).sendFaxBinary(CORP, {
        SenderNum: '0211111111',
        Receiver: Array.from({ length: 1001 }, () => ({ receiveNum: '0222222222' })),
        BinaryFiles: files,
      })
    ).resolves.toBe(receipt.receiptNum)
    expect(await readMultipart(request(mock).init)).toMatchObject({ fileCount: 1, form: { rcvs: expect.any(Array) } })
    const form = (await readMultipart(request(mock).init)).form as { rcvs: unknown[] }
    expect(form.rcvs).toHaveLength(1001)
  })
  test.each([
    ['sendFaxBinary', [CORP, '0211111111', [{ receiveNum: '0222222222' }], files, undefined]],
    ['sendFaxBinary', [CORP, '0211111111', '0222222222', '고객', files, undefined, '발신자', false, '제목', 'REQ-2', USER]],
    ['resendFax', [CORP, 'R-1', '0211111111', '발신자', [{ receiveNum: '0222222222' }], '20261201120000']],
    ['resendFaxRN', [CORP, 'REQ-1', 'REQ-2', '제목']],
    ['resendFaxRN', [CORP, 'REQ-1', '0211111111', '발신자', [{ receiveNum: '0222222222' }], '20261201120000', '제목', 'REQ-2']],
  ] as const)('%s positional overload succeeds', async (method, args) => {
    stub(receipt)
    await expect(invoke(createFaxPromiseService(config()), method, [...args])).resolves.toBe(receipt.receiptNum)
  })
  test('request-number resend keeps the final legacy overload at ambiguous arity', async () => {
    const mock = stub(receipt)
    await createFaxPromiseService(config()).resendFaxRN(CORP, 'REQ-1', '0222222222', '고객', '20261201120000', '제목', 'REQ-2')
    expect(JSON.parse(request(mock).init.body as string)).toEqual({
      rcvs: [{ rcv: '0222222222', rcvnm: '고객' }],
      sndDT: '20261201120000',
      title: '제목',
      requestNum: 'REQ-2',
    })
  })
  test.each([
    ['getFaxResult', [CORP, '']],
    ['getUnitCost', [CORP, 'invalid']],
    ['getSenderNumberList', ['']],
    ['search', [CORP, 'bad-date', '20261103']],
    ['sendFaxBinary', [CORP, { SenderNum: '0211111111', Receiver: '0222222222', BinaryFiles: [] }]],
    ['sendFaxBinary', [CORP, { SenderNum: '0211111111', Receiver: [], BinaryFiles: files }]],
  ])('%s rejects invalid required inputs before fetching', async (method, args) => {
    const mock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', mock)
    await expect(invoke(createFaxPromiseService(config()), method as string, args as unknown[])).rejects.toMatchObject({ code: -99999999 })
    expect(mock).not.toHaveBeenCalled()
  })
  test('API error callback and error-only callback preserve errors', async () => {
    stub({ code: -16010015, message: 'invalid fax sender' }, 400)
    const error = await new Promise((resolve) => createFaxService(config()).checkSenderNumber(CORP, '0211111111', undefined, resolve))
    expect(error).toMatchObject({ code: -16010015, message: 'invalid fax sender' })
  })
  test('user callback exception does not call the default API error handler', async () => {
    stub([result])
    const onError = vi.fn<(error: unknown) => void>()
    await new Promise<void>((resolve) =>
      createFaxService(config(onError)).getFaxResult(CORP, receipt.receiptNum, () => {
        resolve()
        throw new Error('hook')
      })
    )
    await Promise.resolve()
    expect(onError).not.toHaveBeenCalled()
  })
})
