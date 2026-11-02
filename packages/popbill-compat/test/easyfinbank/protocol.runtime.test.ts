import { createEasyFinBankPromiseService, createEasyFinBankService } from '@/services/easyfinbank'

const corpNum = '1234567890'
const userId = 'bank-user'
const jobId = '202611030000000001'
const ok = { code: 1, message: 'OK' }
const account = {
  BankCode: '0004',
  AccountNumber: '0123456789',
  AccountPWD: '0000',
  AccountType: '법인' as const,
  IdentityNumber: corpNum,
  UsePeriod: 3,
}
const config = { LinkID: 'TEST', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
interface Case {
  method: string
  args: unknown[]
  path: string
  verb?: string
  query?: Record<string, string>
  body?: unknown
  response: unknown
  expected?: unknown
}
const cases: Case[] = [
  {
    method: 'getBankAccountMgtURL',
    args: [],
    path: '/EasyFin/Bank',
    query: { TG: 'BankAccount' },
    response: { url: 'https://bank.test/accounts' },
    expected: 'https://bank.test/accounts',
  },
  {
    method: 'registBankAccount',
    args: [account],
    path: '/EasyFin/Bank/BankAccount/Regist',
    verb: 'POST',
    query: { UsePeriod: '3' },
    body: { BankCode: '0004', AccountNumber: '0123456789', AccountPWD: '0000', AccountType: '법인', IdentityNumber: corpNum },
    response: ok,
  },
  {
    method: 'updateBankAccount',
    args: ['0004', '0123456789', { AccountPWD: '0001', Memo: '메모' }],
    path: '/EasyFin/Bank/BankAccount/0004/0123456789/Update',
    verb: 'POST',
    body: { BankCode: '0004', AccountNumber: '0123456789', AccountPWD: '0001', Memo: '메모' },
    response: ok,
  },
  {
    method: 'getBankAccountInfo',
    args: ['0004', '0123456789'],
    path: '/EasyFin/Bank/BankAccount/0004/0123456789',
    response: { accountNumber: '0123456789' },
  },
  { method: 'listBankAccount', args: [], path: '/EasyFin/Bank/ListBankAccount', response: [] },
  {
    method: 'closeBankAccount',
    args: ['0004', '0123456789', '일반'],
    path: '/EasyFin/Bank/BankAccount/Close',
    verb: 'POST',
    query: { BankCode: '0004', AccountNumber: '0123456789', CloseType: '일반' },
    response: ok,
  },
  {
    method: 'revokeCloseBankAccount',
    args: ['0004', '0123456789'],
    path: '/EasyFin/Bank/BankAccount/RevokeClose',
    verb: 'POST',
    query: { BankCode: '0004', AccountNumber: '0123456789' },
    response: ok,
  },
  {
    method: 'deleteBankAccount',
    args: ['0004', '0123456789'],
    path: '/EasyFin/Bank/BankAccount/Delete',
    verb: 'POST',
    body: { BankCode: '0004', AccountNumber: '0123456789' },
    response: ok,
  },
  {
    method: 'requestJob',
    args: ['0004', '0123456789', '20261101', '20261103'],
    path: '/EasyFin/Bank/BankAccount',
    verb: 'POST',
    query: { BankCode: '0004', AccountNumber: '0123456789', SDate: '20261101', EDate: '20261103' },
    response: { jobID: jobId },
    expected: jobId,
  },
  {
    method: 'getJobState',
    args: [jobId],
    path: `/EasyFin/Bank/${jobId}/State`,
    response: { jobID: jobId, jobState: 3, errorCode: -18000001, errorReason: '수집 실패' },
  },
  { method: 'listActiveJob', args: [], path: '/EasyFin/Bank/JobList', response: [] },
  {
    method: 'search',
    args: [jobId, ['I', 'O'], '한글 & 메모/?', 2, 1000, 'A'],
    path: `/EasyFin/Bank/${jobId}`,
    query: { TradeType: 'I,O', SearchString: '한글 & 메모/?', Page: '2', PerPage: '1000', Order: 'A' },
    response: { ...ok, list: [] },
  },
  {
    method: 'summary',
    args: [jobId, undefined, undefined],
    path: `/EasyFin/Bank/${jobId}/Summary`,
    query: { TradeType: '' },
    response: { count: 0, cntAccIn: 0, cntAccOut: 0, totalAccIn: 0, totalAccOut: 0 },
  },
  {
    method: 'saveMemo',
    args: ['transaction/?', '메모 & 내용'],
    path: '/EasyFin/Bank/SaveMemo',
    verb: 'POST',
    query: { TID: 'transaction/?', Memo: '메모 & 내용' },
    response: ok,
  },
  {
    method: 'getFlatRatePopUpURL',
    args: [],
    path: '/EasyFin/Bank',
    query: { TG: 'CHRG' },
    response: { url: 'https://bank.test/subscription' },
    expected: 'https://bank.test/subscription',
  },
  { method: 'getFlatRateState', args: ['0004', '0123456789'], path: '/EasyFin/Bank/Contract/0004/0123456789', response: { state: 1 } },
  {
    method: 'getChargeInfo',
    args: [],
    path: '/EasyFin/Bank/ChargeInfo',
    response: { unitCost: '10000', chargeMethod: '선불', rateSystem: '정액제' },
  },
]

function stubResponse(body: unknown, status = 200) {
  const fetchMock = vi.fn<typeof fetch>()
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify({ session_token: 'bank-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }), { status: 200 })
  )
  fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => vi.unstubAllGlobals())

describe.each(['promise', 'callback'] as const)('EasyFinBank %s HTTP contracts', (mode) => {
  it.each(cases)('$method', async (testCase) => {
    const fetchMock = stubResponse(testCase.response)
    const service = mode === 'promise' ? createEasyFinBankPromiseService(config) : createEasyFinBankService(config)
    const method = Reflect.get(service, testCase.method) as (...args: unknown[]) => unknown
    const args = [corpNum, ...testCase.args, userId]
    const result = mode === 'promise' ? await method(...args) : await new Promise((resolve, reject) => method(...args, resolve, reject))
    expect(result).toEqual(testCase.expected ?? testCase.response)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const authBody = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string) as { scope: string[] }
    expect(authBody.scope).toEqual(['member', '180'])
    const [target, init] = fetchMock.mock.calls[1]!
    const url = new URL(target instanceof Request ? target.url : (target ?? ''))
    expect(url.pathname).toBe(testCase.path)
    expect(Object.fromEntries(url.searchParams)).toEqual(testCase.query ?? {})
    expect(init?.method).toBe(testCase.verb ?? 'GET')
    expect(new Headers(init?.headers).get('X-PB-UserID')).toBe(userId)
    expect(init?.body ? JSON.parse(init.body as string) : undefined).toEqual(testCase.body)
  })
})

it('supports the older update object overload without mutating either form', async () => {
  const original = Object.freeze({ BankCode: '0004', AccountNumber: '0123456789', AccountPWD: '0001', Memo: 'memo' })
  const fetchMock = stubResponse(ok)
  await createEasyFinBankPromiseService(config).updateBankAccount(corpNum, original)
  expect(JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string)).toEqual(original)
  expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).has('X-PB-UserID')).toBe(false)
})

it('does not mutate the modern positional update form', async () => {
  const original = Object.freeze({ AccountPWD: '0001' })
  stubResponse(ok)
  await createEasyFinBankPromiseService(config).updateBankAccount(corpNum, '0004', '0123456789', original)
  expect(original).toEqual({ AccountPWD: '0001' })
})

it('preserves provider errors and isolates the default error hook', async () => {
  const error = { code: -18000001, message: 'Expired collection job' }
  const hook = vi.fn<() => void>(() => {
    throw new Error('hook')
  })
  stubResponse(error, 400)
  await expect(createEasyFinBankPromiseService({ ...config, defaultErrorHandler: hook }).getJobState(corpNum, jobId)).rejects.toMatchObject(error)
  expect(hook).toHaveBeenCalledTimes(1)
})

it('supports an explicit error-only callback', async () => {
  const error = { code: -18000001, message: 'Expired collection job' }
  stubResponse(error, 400)
  const value = await new Promise((resolve) => createEasyFinBankService(config).getJobState(corpNum, jobId, undefined, resolve))
  expect(value).toMatchObject(error)
})

it('keeps undefined search Order when both callback slots are present', async () => {
  const response = { ...ok, list: [] }
  const fetchMock = stubResponse(response)
  const result = await new Promise((resolve, reject) => {
    createEasyFinBankService(config).search(corpNum, jobId, ['I'], '', 1, 500, undefined, resolve, reject)
  })
  expect(result).toEqual(response)
  const target = fetchMock.mock.calls[1]?.[0]
  const url = new URL(target instanceof Request ? target.url : (target ?? ''))
  expect(Object.fromEntries(url.searchParams)).toEqual({ TradeType: 'I', Page: '1', PerPage: '500' })
})

it.each([
  ['getJobState', [corpNum, 'short']],
  ['summary', [corpNum, 'short', [], '']],
  ['requestJob', [corpNum, '0004', '1234', '20261301', '20261103']],
  ['closeBankAccount', [corpNum, '0004', '1234', '']],
  ['getFlatRateState', [corpNum, '004', '1234']],
] as const)('rejects invalid %s input before sending HTTP', async (methodName, args) => {
  const fetchMock = vi.fn<typeof fetch>()
  vi.stubGlobal('fetch', fetchMock)
  const method = Reflect.get(createEasyFinBankPromiseService(config), methodName) as (...values: unknown[]) => Promise<unknown>
  await expect(method(...args)).rejects.toMatchObject({ code: -99999999 })
  expect(fetchMock).not.toHaveBeenCalled()
})

it('delegates additional closure types as encoded provider values', async () => {
  const fetchMock = stubResponse(ok)
  await createEasyFinBankPromiseService(config).closeBankAccount(corpNum, '0004', '1234', 'NEXT&flag')
  const target = fetchMock.mock.calls[1]?.[0]
  const url = new URL(target instanceof Request ? target.url : (target ?? ''))
  expect(url.searchParams.get('CloseType')).toBe('NEXT&flag')
  expect(url.searchParams.has('flag')).toBe(false)
})
