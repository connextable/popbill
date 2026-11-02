import { createHTTaxinvoicePromiseService, createHTTaxinvoiceService } from '@/services/httaxinvoice'
import type { CompatConfig } from '@/config'
import type { HomeTaxTaxInvoiceChargeInfoApiResponse } from '@connextable/popbill-spec'

const corpNum = '1234567890'
const jobId = '026091610000000001'
const confirmNum = '202609164100020300007559'
const userId = 'hometax-user'
const base = '/HomeTax/Taxinvoice'
const config: CompatConfig = { LinkID: 'TEST_LINK_ID', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
const ok = { code: 1, message: '처리 완료' }
const url = 'https://test.popbill.com/example'
function fetchUrl(value: Parameters<typeof fetch>[0] | undefined): string {
  if (value === undefined) throw new Error('Expected an HTTP request.')
  return typeof value === 'string' ? value : value instanceof URL ? value.href : value.url
}
function jsonBody(value: RequestInit['body']): unknown {
  if (typeof value !== 'string') throw new Error('Expected a serialized JSON body.')
  return JSON.parse(value) as unknown
}
interface Case {
  method: string
  args: unknown[]
  path: string
  response: unknown
  expected?: unknown
  query?: Record<string, string>
  verb?: string
  body?: unknown
  noUserId?: boolean
}
const filters = [['N', 'M'], ['T', 'Z'], ['R', 'C'], 'B', '0', '0001,0002']
const cases: Case[] = [
  { method: 'getCertificatePopUpURL', args: [], path: base, query: { TG: 'CERT' }, response: { url }, expected: url },
  {
    method: 'getCertificateExpireDate',
    args: [],
    path: base + '/CertInfo',
    response: { certificateExpiration: '20271111204731' },
    expected: '20271111204731',
    noUserId: true,
  },
  { method: 'checkCertValidation', args: [], path: base + '/CertCheck', response: ok, noUserId: true },
  {
    method: 'registDeptUser',
    args: ['dept-user', 'secret-password', '9001011'],
    path: base + '/DeptUser',
    verb: 'POST',
    body: { id: 'dept-user', pwd: 'secret-password', secAuth: '9001011' },
    response: ok,
  },
  { method: 'checkDeptUser', args: [], path: base + '/DeptUser', response: ok },
  { method: 'checkLoginDeptUser', args: [], path: base + '/DeptUser/Check', response: ok, noUserId: true },
  { method: 'deleteDeptUser', args: [], path: base + '/DeptUser', verb: 'DELETE', response: ok },
  {
    method: 'requestJob',
    args: ['BUY', 'S', '20260901', '20260916'],
    path: base + '/BUY',
    query: { DType: 'S', SDate: '20260901', EDate: '20260916' },
    verb: 'POST',
    response: { jobID: jobId },
    expected: jobId,
  },
  { method: 'getJobState', args: [jobId], path: base + '/' + jobId + '/State', response: { jobID: jobId, jobState: 3, errorCode: 1 } },
  { method: 'listActiveJob', args: [], path: base + '/JobList', response: [{ jobID: jobId, jobState: 2 }] },
  {
    method: 'search',
    args: [jobId, ...filters, 2, 100, 'A', userId, '상호 & 검색/?'],
    path: base + '/' + jobId,
    query: {
      Type: 'N,M',
      TaxType: 'T,Z',
      PurposeType: 'R,C',
      TaxRegIDType: 'B',
      TaxRegIDYN: '0',
      TaxRegID: '0001,0002',
      SearchString: '상호 & 검색/?',
      Page: '2',
      PerPage: '100',
      Order: 'A',
    },
    response: { code: 1, total: 1, list: [{ ntsconfirmNum: confirmNum, totalAmount: '-110000' }] },
  },
  {
    method: 'summary',
    args: [jobId, ...filters, userId, '검색 &/?'],
    path: base + '/' + jobId + '/Summary',
    query: { Type: 'N,M', TaxType: 'T,Z', PurposeType: 'R,C', TaxRegIDType: 'B', TaxRegIDYN: '0', TaxRegID: '0001,0002', SearchString: '검색 &/?' },
    response: { count: 1, supplyCostTotal: 100000, taxTotal: 10000, amountTotal: 110000 },
  },
  {
    method: 'getTaxinvoice',
    args: [confirmNum],
    path: base + '/' + confirmNum,
    response: { ntsconfirmNum: confirmNum, invoiceType: 101, totalAmount: '999999999999999999', detailList: [] },
  },
  {
    method: 'getXML',
    args: [confirmNum],
    path: base + '/' + confirmNum,
    query: { T: 'xml' },
    response: { ResultCode: 1, Message: confirmNum, retObject: '<?xml version="1.0"?><TaxInvoice />' },
  },
  { method: 'getPopUpURL', args: [confirmNum], path: base + '/' + confirmNum + '/PopUp', response: { url }, expected: url },
  { method: 'getPrintURL', args: [confirmNum], path: base + '/' + confirmNum + '/Print', response: { url }, expected: url },
  { method: 'getFlatRatePopUpURL', args: [], path: base, query: { TG: 'CHRG' }, response: { url }, expected: url },
  { method: 'getFlatRateState', args: [], path: base + '/Contract', response: { state: 1, closeRequestYN: false, baseDate: 25 } },
  { method: 'getChargeInfo', args: [], path: base + '/ChargeInfo', response: { unitCost: '1000', chargeMethod: '연동', rateSystem: '정액제' } },
]
function mockResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
}
function stub(value: unknown, status = 200) {
  const mock = vi.fn<typeof fetch>()
  mock.mockResolvedValueOnce(mockResponse({ session_token: 'test-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
  mock.mockResolvedValueOnce(mockResponse(value, status))
  vi.stubGlobal('fetch', mock)
  return mock
}
function invoke(service: object, method: string, args: unknown[]): unknown {
  const fn: unknown = Reflect.get(service, method)
  if (typeof fn !== 'function') throw new Error('Missing method: ' + method)
  return Reflect.apply(fn, service, args)
}
describe('홈택스 세금계산서 수집 wire contract', () => {
  afterEach(() => vi.unstubAllGlobals())
  describe.each(['promise', 'callback'] as const)('%s', (style) => {
    test.each(cases)('$method preserves the official HTTP contract and legacy result', async (entry) => {
      const fetchMock = stub(entry.response)
      const service = style === 'promise' ? createHTTaxinvoicePromiseService(config) : createHTTaxinvoiceService(config)
      const args = [corpNum, ...entry.args]
      if (!entry.noUserId && entry.method !== 'search' && entry.method !== 'summary') args.push(userId)
      const result = await (style === 'promise'
        ? invoke(service, entry.method, args)
        : new Promise((resolve, reject) => invoke(service, entry.method, [...args, resolve, reject])))
      expect(result).toEqual(entry.expected ?? entry.response)
      expect(fetchMock).toHaveBeenCalledTimes(2)
      const requestUrl = new URL(fetchUrl(fetchMock.mock.calls[1]?.[0]))
      const init = fetchMock.mock.calls[1]?.[1] as RequestInit
      const headers = init.headers as Record<string, string>
      expect(requestUrl.pathname).toBe(entry.path)
      expect(Object.fromEntries(requestUrl.searchParams)).toEqual(entry.query ?? {})
      expect(init.method).toBe((entry.verb ?? 'GET') === 'GET' ? 'GET' : 'POST')
      expect(headers['X-HTTP-Method-Override']).toBe(entry.verb === 'DELETE' ? 'DELETE' : undefined)
      expect(headers['x-pb-userid']).toBe(entry.noUserId ? undefined : userId)
      expect(init.body === undefined ? undefined : jsonBody(init.body)).toEqual(entry.body)
      const auth = fetchMock.mock.calls[0]?.[1] as RequestInit
      expect(jsonBody(auth.body)).toMatchObject({ scope: ['member', '111'] })
    })
  })
  test.each([[], [userId], ['9001011', userId]] as const)('department registration preserves shorter overload %j', async (...options) => {
    const fetchMock = stub(ok)
    await invoke(createHTTaxinvoicePromiseService(config), 'registDeptUser', [corpNum, 'dept', 'password', ...options])
    const init = fetchMock.mock.calls[1]?.[1] as RequestInit
    expect(jsonBody(init.body)).toEqual({ id: 'dept', pwd: 'password', ...(options.length === 2 ? { secAuth: '9001011' } : {}) })
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe(options.length ? userId : undefined)
  })
  test('search and summary accept omitted UserID and SearchString without shifting filters', async () => {
    for (const method of ['search', 'summary']) {
      const fetchMock = stub(method === 'search' ? { code: 1, list: [] } : { count: 0 })
      const tail = method === 'search' ? [1, 500, 'D'] : []
      await new Promise((resolve, reject) =>
        invoke(createHTTaxinvoiceService(config), method, [corpNum, jobId, ...filters, ...tail, resolve, reject])
      )
      const requestUrl = new URL(fetchUrl(fetchMock.mock.calls[1]?.[0]))
      expect(requestUrl.searchParams.has('SearchString')).toBe(false)
      const headers = fetchMock.mock.calls[1]?.[1]?.headers as Record<string, string> | undefined
      expect(headers?.['x-pb-userid']).toBeUndefined()
    }
  })
  test.each([
    ['getJobState', ['short']],
    ['getTaxinvoice', ['short']],
    ['getXML', ['short']],
    ['requestJob', ['SELL', '', '20260901', '20260916']],
  ])('invalid %s input never reaches the network', async (method, args) => {
    const mock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', mock)
    await expect(invoke(createHTTaxinvoicePromiseService(config), String(method), [corpNum, ...(args as string[])])).rejects.toMatchObject({
      code: -99999999,
    })
    expect(mock).not.toHaveBeenCalled()
  })
  test('HTTP provider errors retain operation and code', async () => {
    stub({ code: -11101001, message: '작업아이디의 수집작업이 존재하지 않습니다.' }, 400)
    await expect(createHTTaxinvoicePromiseService(config).getJobState(corpNum, jobId)).rejects.toMatchObject({
      code: -11101001,
      message: '작업아이디의 수집작업이 존재하지 않습니다.',
    })
  })
  test('encodes extended document filters without introducing other query parameters', async () => {
    const fetchMock = stub({ code: 1, list: [] })
    await createHTTaxinvoicePromiseService(config).search(
      corpNum,
      jobId,
      ['NEXT&TaxType=Z'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )
    const requestUrl = new URL(fetchUrl(fetchMock.mock.calls[1]?.[0]))
    expect(requestUrl.searchParams.get('Type')).toBe('NEXT&TaxType=Z')
    expect(requestUrl.searchParams.has('TaxType')).toBe(false)
  })
  test('forwards future collection types as encoded provider values', async () => {
    const fetchMock = stub({ jobID: jobId })
    await createHTTaxinvoicePromiseService(config).requestJob(corpNum, 'NEXT/type', 'R&extra', '20260901', '20260916')
    const requestUrl = new URL(fetchUrl(fetchMock.mock.calls[1]?.[0]))
    expect(requestUrl.pathname).toBe('/HomeTax/Taxinvoice/NEXT%2Ftype')
    expect(requestUrl.searchParams.get('DType')).toBe('R&extra')
    expect(requestUrl.searchParams.has('extra')).toBe(false)
  })
  test('callback validation errors reach the error callback without a synchronous throw', async () => {
    const mock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', mock)
    const result = await new Promise((resolve) => {
      expect(() => createHTTaxinvoiceService(config).getJobState(corpNum, 'short', undefined, resolve)).not.toThrow()
    })
    expect(result).toMatchObject({ code: -99999999 })
    expect(mock).not.toHaveBeenCalled()
  })
  test('callback failures without an explicit error callback reach the default handler', async () => {
    const mock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', mock)
    const result = await new Promise((resolve) => {
      createHTTaxinvoiceService({ ...config, defaultErrorHandler: resolve }).registDeptUser(corpNum, '', 'password')
    })
    expect(result).toMatchObject({ code: -99999999 })
    expect(mock).not.toHaveBeenCalled()
  })
  test('undefined optional arguments require an explicit trailing callback slot', () => {
    const assertSignatures = (service: ReturnType<typeof createHTTaxinvoiceService>) => {
      // @ts-expect-error A single callback after undefined is the error-only legacy form.
      service.getChargeInfo(corpNum, undefined, (value: HomeTaxTaxInvoiceChargeInfoApiResponse) => value.unitCost)
      service.getChargeInfo(corpNum, undefined, () => undefined, undefined)
      // @ts-expect-error An undefined Order requires both callback slots.
      service.search(corpNum, jobId, undefined, undefined, undefined, undefined, undefined, undefined, 1, 500, undefined, () => undefined)
      service.search(corpNum, jobId, undefined, undefined, undefined, undefined, undefined, undefined, 1, 500, undefined, () => undefined, undefined)
      // @ts-expect-error An undefined final tax registration filter requires both callback slots.
      service.summary(corpNum, jobId, undefined, undefined, undefined, undefined, undefined, undefined, () => undefined)
      service.summary(corpNum, jobId, undefined, undefined, undefined, undefined, undefined, undefined, () => undefined, undefined)
    }
    expectTypeOf(assertSignatures).toBeFunction()
  })
  test.each(['getJobState', 'getXML', 'requestJob', 'registDeptUser'])(
    '%s validates the member business number before other arguments',
    async (method) => {
      const mock = vi.fn<typeof fetch>()
      vi.stubGlobal('fetch', mock)
      await expect(invoke(createHTTaxinvoicePromiseService(config), method, ['', '', '', '', '', ''])).rejects.toMatchObject({
        code: -99999999,
        message: '팝빌회원 사업자번호가 입력되지 않았습니다.',
      })
      expect(mock).not.toHaveBeenCalled()
    }
  )
})
