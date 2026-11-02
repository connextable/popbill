import { createHTCashbillPromiseService, createHTCashbillService, type HTCashbillCallbackService } from '@/services/htcashbill'
import { HTCASHBILL_METHODS } from '@/services/htcashbill/methods'
import type { CompatConfig } from '@/config'

const CORP = '1234567890'
const USER = 'cashbill-user'
const JOB = '026091614000000002'
const success = { code: 1, message: '처리 완료' }
const config = (): CompatConfig => ({ LinkID: 'TEST_LINK_ID', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true })

function stub(body: unknown, status = 200) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ session_token: 'cashbill-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
    )
    .mockResolvedValueOnce(new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function requestUrl(target: Parameters<typeof fetch>[0] | undefined): URL {
  return new URL(target instanceof Request ? target.url : target instanceof URL ? target.href : (target ?? ''))
}

function jsonBody(body: RequestInit['body']): unknown {
  if (typeof body !== 'string') throw new Error('Expected a JSON string body')
  return JSON.parse(body) as unknown
}

const cases: {
  method: (typeof HTCASHBILL_METHODS)[number]
  args: unknown[]
  path: string
  response: unknown
  result?: unknown
  query?: Record<string, string>
  user?: string
  override?: string
  body?: unknown
  post?: boolean
}[] = [
  {
    method: 'getCertificatePopUpURL',
    args: [CORP, USER],
    path: '/HomeTax/Cashbill',
    query: { TG: 'CERT' },
    response: { url: 'https://example.test/cert' },
    result: 'https://example.test/cert',
    user: USER,
  },
  {
    method: 'getCertificateExpireDate',
    args: [CORP],
    path: '/HomeTax/Cashbill/CertInfo',
    response: { certificateExpiration: '20271231235959' },
    result: '20271231235959',
  },
  { method: 'checkCertValidation', args: [CORP], path: '/HomeTax/Cashbill/CertCheck', response: success },
  {
    method: 'registDeptUser',
    args: [CORP, 'dept-user', 'dept-password', '9001011', USER],
    path: '/HomeTax/Cashbill/DeptUser',
    response: success,
    user: USER,
    post: true,
    body: { id: 'dept-user', pwd: 'dept-password', secAuth: '9001011' },
  },
  { method: 'checkDeptUser', args: [CORP, USER], path: '/HomeTax/Cashbill/DeptUser', response: success, user: USER },
  { method: 'checkLoginDeptUser', args: [CORP], path: '/HomeTax/Cashbill/DeptUser/Check', response: success },
  { method: 'deleteDeptUser', args: [CORP, USER], path: '/HomeTax/Cashbill/DeptUser', response: success, user: USER, post: true, override: 'DELETE' },
  {
    method: 'requestJob',
    args: [CORP, 'SELL', '20260901', '20260930', USER],
    path: '/HomeTax/Cashbill/SELL',
    query: { SDate: '20260901', EDate: '20260930' },
    response: { jobID: JOB },
    result: JOB,
    post: true,
    user: USER,
  },
  {
    method: 'getJobState',
    args: [CORP, JOB, USER],
    path: `/HomeTax/Cashbill/${JOB}/State`,
    response: { jobID: JOB, jobState: 3, errorCode: -14100001, errorReason: '수집 실패' },
    user: USER,
  },
  { method: 'listActiveJob', args: [CORP, USER], path: '/HomeTax/Cashbill/JobList', response: [{ jobID: JOB, jobState: '2' }], user: USER },
  {
    method: 'search',
    args: [CORP, JOB, ['N', 'C'], ['P'], 2, 1000, 'A', USER],
    path: `/HomeTax/Cashbill/${JOB}`,
    query: { TradeType: 'N,C', TradeUsage: 'P', Page: '2', PerPage: '1000', Order: 'A' },
    response: { code: 1, message: '확인완료', total: 0, list: [] },
    user: USER,
  },
  {
    method: 'summary',
    args: [CORP, JOB, [], [], USER],
    path: `/HomeTax/Cashbill/${JOB}/Summary`,
    query: { TradeType: '' },
    response: { count: 0, supplyCostTotal: 0, taxTotal: 0, serviceFeeTotal: 0, amountTotal: 0 },
    user: USER,
  },
  {
    method: 'getFlatRatePopUpURL',
    args: [CORP, USER],
    path: '/HomeTax/Cashbill',
    query: { TG: 'CHRG' },
    response: { url: 'https://example.test/charge' },
    result: 'https://example.test/charge',
    user: USER,
  },
  {
    method: 'getFlatRateState',
    args: [CORP, USER],
    path: '/HomeTax/Cashbill/Contract',
    response: { state: 1, closeRequestYN: false, useRestrictYN: false },
    user: USER,
  },
  {
    method: 'getChargeInfo',
    args: [CORP, USER],
    path: '/HomeTax/Cashbill/ChargeInfo',
    response: { unitCost: '1000', chargeMethod: '연동', rateSystem: '정액제' },
    user: USER,
  },
]

afterEach(() => vi.unstubAllGlobals())

describe('HTCashbill HTTP contracts', () => {
  it.each(cases)('$method uses its documented request and legacy response', async (testCase) => {
    const fetchMock = stub(testCase.response)
    const service = createHTCashbillPromiseService(config())
    const method: unknown = Reflect.get(service, testCase.method)
    if (typeof method !== 'function') throw new Error('method missing')
    expect(await Reflect.apply(method, service, testCase.args)).toEqual(testCase.result ?? testCase.response)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [, authInit] = fetchMock.mock.calls[0]!
    expect(jsonBody(authInit?.body)).toMatchObject({ scope: ['member', '141'], access_id: CORP })
    const [target, init] = fetchMock.mock.calls[1]!
    const url = requestUrl(target)
    expect(url.origin).toBe('https://popbill-test.linkhub.co.kr')
    expect(url.pathname).toBe(testCase.path)
    expect(Object.fromEntries(url.searchParams)).toEqual(testCase.query ?? {})
    expect(init?.method).toBe(testCase.post ? 'POST' : 'GET')
    const headers = new Headers(init?.headers)
    expect(headers.get('authorization')).toBe('Bearer cashbill-token')
    expect(headers.get('x-pb-userid')).toBe(testCase.user ?? null)
    expect(headers.get('x-http-method-override')).toBe(testCase.override ?? null)
    expect(init?.body ? jsonBody(init.body) : undefined).toEqual(testCase.body)
  })

  it('covers every service method', () => {
    expect(cases.map((entry) => entry.method).sort()).toEqual([...HTCASHBILL_METHODS].sort())
  })

  it.each([
    { args: [CORP, 'dept-user', 'dept-password'], user: null, secAuth: undefined },
    { args: [CORP, 'dept-user', 'dept-password', USER], user: USER, secAuth: undefined },
    { args: [CORP, 'dept-user', 'dept-password', undefined, USER], user: USER, secAuth: undefined },
  ])('preserves department-user positional overload $args', async ({ args, user, secAuth }) => {
    const fetchMock = stub(success)
    const service = createHTCashbillPromiseService(config())
    const method: unknown = Reflect.get(service, 'registDeptUser')
    if (typeof method !== 'function') throw new Error('Missing method')
    await Reflect.apply(method, service, args)
    const init = fetchMock.mock.calls[1]?.[1]
    expect(new Headers(init?.headers).get('x-pb-userid')).toBe(user)
    expect(jsonBody(init?.body)).toEqual({ id: 'dept-user', pwd: 'dept-password', ...(secAuth ? { secAuth } : {}) })
  })

  it.each([3, 4, 5])('preserves department-user callback overload with %s positional arguments', async (length) => {
    const fetchMock = stub(success)
    const args =
      length === 3
        ? [CORP, 'dept-user', 'dept-password']
        : length === 4
          ? [CORP, 'dept-user', 'dept-password', USER]
          : [CORP, 'dept-user', 'dept-password', '9001011', USER]
    const service = createHTCashbillService(config())
    await expect(new Promise((resolve, reject) => Reflect.apply(service.registDeptUser, service, [...args, resolve, reject]))).resolves.toEqual(
      success
    )
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get('x-pb-userid')).toBe(length === 3 ? null : USER)
  })

  it('leaves omitted pagination and filters to provider defaults', async () => {
    const fetchMock = stub({ ...success, list: [] })
    await createHTCashbillPromiseService(config()).search(CORP, JOB, undefined, undefined, undefined, undefined, undefined)
    expect(requestUrl(fetchMock.mock.calls[1]?.[0]).search).toBe('?TradeType=')
  })

  it('accepts explicit undefined user and pagination slots when both callback slots are retained', async () => {
    stub({ ...success, list: [] })
    const service = createHTCashbillService(config())
    await expect(
      new Promise((resolve) => service.search(CORP, JOB, undefined, undefined, undefined, undefined, undefined, undefined, resolve, undefined))
    ).resolves.toEqual({ ...success, list: [] })
    const checkTypes = (service: HTCashbillCallbackService) => {
      service.search(CORP, JOB, undefined, undefined, undefined, undefined, 'D', (response) => void response.list)
      service.summary(CORP, JOB, undefined, ['P'], (response) => void response.count)
      // @ts-expect-error An undefined user slot with one callback is the error-only legacy invocation.
      service.getChargeInfo(CORP, undefined, (response: { unitCost?: string }) => void response)
      // @ts-expect-error An undefined Order needs both callback slots to distinguish success from error-only.
      service.search(CORP, JOB, undefined, undefined, undefined, undefined, undefined, (response: { list?: unknown[] }) => void response)
      // @ts-expect-error An undefined IdentityNum/UserID slot also needs both callback slots.
      service.registDeptUser(CORP, 'dept-user', 'dept-password', undefined, (response: { code: number }) => void response)
    }
    expectTypeOf(checkTypes).toBeFunction()
  })

  it('rejects invalid JobID before authentication', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    await expect(createHTCashbillPromiseService(config()).getJobState(CORP, 'bad-job')).rejects.toMatchObject({ code: -99999999 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('routes callback validation errors without throwing synchronously', async () => {
    const service = createHTCashbillService(config())
    await expect(new Promise((resolve) => service.getJobState(CORP, 'bad-job', undefined, resolve))).resolves.toMatchObject({ code: -99999999 })
  })

  it('preserves provider errors for expired jobs', async () => {
    stub({ code: -11101001, message: '작업아이디의 수집작업이 존재하지 않습니다.' }, 400)
    await expect(createHTCashbillPromiseService(config()).getJobState(CORP, JOB)).rejects.toMatchObject({ code: -11101001 })
  })

  it('keeps the API error when the default error hook throws', async () => {
    stub({ code: -10000038, message: '회원의 아이디가 아닙니다.' }, 400)
    const service = createHTCashbillPromiseService({
      ...config(),
      defaultErrorHandler() {
        throw new Error('hook failed')
      },
    })
    await expect(service.checkDeptUser(CORP)).rejects.toMatchObject({ code: -10000038 })
  })
})
