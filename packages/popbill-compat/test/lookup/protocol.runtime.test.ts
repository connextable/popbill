import { createClosedownPromiseService, createClosedownService } from '@/services/closedown'
import { createBizInfoCheckPromiseService, createBizInfoCheckService } from '@/services/bizinfocheck'
import { createAccountCheckPromiseService, createAccountCheckService } from '@/services/accountcheck'
import type { CompatConfig } from '@/config'

const corpNum = '1234567890'
const userId = 'lookup-user'
const config: CompatConfig = { LinkID: 'TEST_LINK', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
const charge = { unitCost: '1.25', chargeMethod: '선불', rateSystem: '종량제' }
const status = { corpNum: '8888888888', taxType: '10', typeDate: null, state: '01', stateDate: null, checkDate: '2026-11-03' }
const account = {
  result: 100,
  resultMessage: '정상',
  accountName: '홍길동',
  bankCode: '0004',
  accountNumber: '123-456/789',
  checkDT: '20261103100000',
}

const cases = [
  {
    service: 'closedown',
    method: 'checkCorpNum',
    args: [corpNum, '8888888888', userId],
    path: '/CloseDown',
    query: { CN: '8888888888' },
    response: status,
  },
  {
    service: 'closedown',
    method: 'checkCorpNums',
    args: [corpNum, ['8888888888', '9999999999'], userId],
    path: '/CloseDown',
    verb: 'POST',
    body: ['8888888888', '9999999999'],
    response: [status],
  },
  { service: 'closedown', method: 'getChargeInfo', args: [corpNum, userId], path: '/CloseDown/ChargeInfo', response: charge },
  {
    service: 'closedown',
    method: 'getUnitCost',
    args: [corpNum],
    path: '/CloseDown/UnitCost',
    response: { unitCost: '1.25' },
    expected: '1.25',
    noUser: true,
  },
  {
    service: 'bizinfocheck',
    method: 'checkBizInfo',
    args: [corpNum, '8888888888', userId],
    path: '/BizInfo/Check',
    query: { CN: '8888888888' },
    response: { corpNum: '8888888888', ceoname: '대표자', result: 100 },
  },
  { service: 'bizinfocheck', method: 'getChargeInfo', args: [corpNum, userId], path: '/BizInfo/ChargeInfo', response: charge },
  {
    service: 'bizinfocheck',
    method: 'getUnitCost',
    args: [corpNum],
    path: '/BizInfo/UnitCost',
    response: { unitCost: '2' },
    expected: '2',
    noUser: true,
  },
  {
    service: 'accountcheck',
    method: 'checkAccountInfo',
    args: [corpNum, '0004', '123-456/789', userId],
    path: '/EasyFin/AccountCheck',
    verb: 'POST',
    query: { c: '0004', n: '123-456/789' },
    response: account,
  },
  {
    service: 'accountcheck',
    method: 'checkDepositorInfo',
    args: [corpNum, '0004', '123-456/789', 'P', '900101', userId],
    path: '/EasyFin/DepositorCheck',
    verb: 'POST',
    query: { c: '0004', n: '123-456/789', t: 'P', p: '900101' },
    response: { ...account, identityNumType: 'P', identityNum: '900101' },
  },
  {
    service: 'accountcheck',
    method: 'getChargeInfo',
    args: [corpNum, '성명', userId],
    path: '/EasyFin/AccountCheck/ChargeInfo',
    query: { serviceType: '성명' },
    response: charge,
  },
  {
    service: 'accountcheck',
    method: 'getUnitCost',
    args: [corpNum, '실명', userId],
    path: '/EasyFin/AccountCheck/UnitCost',
    query: { serviceType: '실명' },
    response: { unitCost: '5.5' },
    expected: '5.5',
  },
] as const

function stub(body: unknown, statusCode = 200) {
  const fetchMock = vi.fn<typeof fetch>()
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify({ session_token: 'lookup-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
  )
  fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status: statusCode, headers: { 'content-type': 'application/json' } }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function invoke(service: object, method: string, args: readonly unknown[]) {
  const handler: unknown = Reflect.get(service, method)
  if (typeof handler !== 'function') throw new Error(`Missing ${method}`)
  return Reflect.apply(handler, service, args)
}

function requestUrl(target: Parameters<typeof fetch>[0]): URL {
  return new URL(target instanceof Request ? target.url : target)
}

afterEach(() => vi.unstubAllGlobals())

describe.each(['promise', 'callback'] as const)('lookup HTTP contracts (%s)', (style) => {
  test.each(cases)('$service.$method preserves wire contract', async (entry) => {
    const fetchMock = stub(entry.response)
    const factories =
      style === 'promise'
        ? { closedown: createClosedownPromiseService, bizinfocheck: createBizInfoCheckPromiseService, accountcheck: createAccountCheckPromiseService }
        : { closedown: createClosedownService, bizinfocheck: createBizInfoCheckService, accountcheck: createAccountCheckService }
    const service = factories[entry.service](config)
    const result =
      style === 'promise'
        ? await invoke(service, entry.method, entry.args)
        : await new Promise((resolve, reject) => invoke(service, entry.method, [...entry.args, resolve, reject]))
    expect(result).toEqual('expected' in entry ? entry.expected : entry.response)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const target = fetchMock.mock.calls[1]!
    const url = requestUrl(target[0])
    expect(url.pathname).toBe(entry.path)
    expect(Object.fromEntries(url.searchParams)).toEqual('query' in entry ? entry.query : {})
    const init = target[1]!
    expect(init.method).toBe('verb' in entry ? entry.verb : 'GET')
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe('noUser' in entry ? undefined : userId)
    expect(typeof init.body === 'string' ? JSON.parse(init.body) : undefined).toEqual('body' in entry ? entry.body : undefined)
    const scope = entry.service === 'closedown' ? ['member', '170'] : entry.service === 'bizinfocheck' ? ['member', '171'] : ['member', '182', '183']
    expect(JSON.parse(fetchMock.mock.calls[0]![1]!.body as string)).toMatchObject({ access_id: corpNum, scope })
  })
})

test('callback short form omits UserID and preserves nullable fields', async () => {
  const fetchMock = stub(status)
  const service = createClosedownService(config)
  const result = await new Promise((resolve, reject) => service.checkCorpNum(corpNum, '8888888888', resolve, reject))
  expect(result).toEqual(status)
  expect((fetchMock.mock.calls[1]![1]!.headers as Record<string, string>)['x-pb-userid']).toBeUndefined()
})

test('explicit undefined UserID and trailing error slot retain success callback', async () => {
  stub(status)
  const service = createClosedownService(config)
  await expect(new Promise((resolve) => service.checkCorpNum(corpNum, '8888888888', undefined, resolve, undefined))).resolves.toEqual(status)
})

test('error-only callback receives validation error without a request', async () => {
  const fetchMock = vi.fn<typeof fetch>()
  vi.stubGlobal('fetch', fetchMock)
  const service = createAccountCheckService(config)
  const error = await new Promise((resolve) => service.checkAccountInfo(corpNum, '004', '123', undefined, resolve))
  expect(error).toMatchObject({ code: -99999999, message: '기관코드가 올바르지 않습니다.' })
  expect(fetchMock).not.toHaveBeenCalled()
})

test('all account cost arguments can be omitted in callback and Promise styles', async () => {
  let fetchMock = stub(charge)
  await expect(createAccountCheckPromiseService(config).getChargeInfo(corpNum)).resolves.toEqual(charge)
  expect(requestUrl(fetchMock.mock.calls[1]![0]).search).toBe('')
  fetchMock = stub({ unitCost: '5' })
  await expect(new Promise((resolve, reject) => createAccountCheckService(config).getUnitCost(corpNum, resolve, reject))).resolves.toBe('5')
  expect(requestUrl(fetchMock.mock.calls[1]![0]).search).toBe('')
})

test.each([
  ['invalid service', () => createAccountCheckPromiseService(config).getUnitCost(corpNum, 'BAD')],
  ['invalid identity type', () => createAccountCheckPromiseService(config).checkDepositorInfo(corpNum, '0004', '123', 'C', '900101')],
  ['nondigit identity', () => createAccountCheckPromiseService(config).checkDepositorInfo(corpNum, '0004', '123', 'P', '9&001')],
  ['empty batch', () => createClosedownPromiseService(config).checkCorpNums(corpNum, [])],
])('%s rejects before network', async (_name, call) => {
  const fetchMock = vi.fn<typeof fetch>()
  vi.stubGlobal('fetch', fetchMock)
  await expect(call()).rejects.toMatchObject({ code: -99999999 })
  expect(fetchMock).not.toHaveBeenCalled()
})

test('API error remains primary when the default error hook throws', async () => {
  stub({ code: -11000001, message: 'API failure' }, 400)
  const onError = vi.fn<() => void>(() => {
    throw new Error('hook failure')
  })
  await expect(
    createBizInfoCheckPromiseService({ ...config, defaultErrorHandler: onError }).checkBizInfo(corpNum, '8888888888')
  ).rejects.toMatchObject({ code: -11000001, message: 'API failure' })
  expect(onError).toHaveBeenCalledOnce()
})

test('member business number is validated before service arguments', async () => {
  await expect(createAccountCheckPromiseService(config).checkDepositorInfo('', '', '', '', '')).rejects.toMatchObject({
    message: '팝빌회원 사업자번호가 입력되지 않았습니다.',
  })
})

test('undefined service type retains a success callback when both callback slots are present', async () => {
  stub(charge)
  await expect(
    new Promise((resolve, reject) => createAccountCheckService(config).getChargeInfo(corpNum, undefined, resolve, reject))
  ).resolves.toEqual(charge)
})

test('ambiguous undefined option plus a single callback is not typed as success', () => {
  const service = createAccountCheckService(config)
  expectTypeOf(service.getChargeInfo).toBeFunction()
  const verifyCallbackTypes = () => {
    service.getChargeInfo(corpNum, undefined, (result) => {
      // @ts-expect-error A single callback after undefined is a failure callback, not ChargeInfo success.
      return result.unitCost
    })
    service.getChargeInfo(corpNum, undefined, () => undefined, undefined)
    service.getChargeInfo(corpNum, undefined, userId, () => undefined)
  }
  expectTypeOf(verifyCallbackTypes).toBeFunction()
})
