import { afterEach, describe, expect, it, vi } from 'vitest'
import { createCommonPromiseService, createCommonService } from '@/services/common'
import type { CompatConfig } from '@/config'

const config: CompatConfig = { LinkID: 'COMMON_LINK', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
const corp = '1234567890'
const user = 'operator'
const result = { code: 1, message: '성공' }
const contact = { id: 'contact', personName: '담당자', tel: '01012345678', email: 'contact@example.com' }
const company = { ceoname: '대표', corpName: '회사', addr: '주소', bizType: '서비스', bizClass: '소프트웨어' }
const payment = { paymentName: '입금자', settleCost: '11000', notifyHP: '01012345678' }
const refund = { ContactName: '담당자', tel: '01012345678', RequestPoint: '100', AccountBank: '은행', AccountNum: '1234', AccountName: '예금주' }
const join = {
  ID: 'member',
  Password: 'secret-password',
  LinkID: 'COMMON_LINK',
  CorpNum: corp,
  CEOName: '대표',
  CorpName: '회사',
  Addr: '주소',
  BizType: '서비스',
  BizClass: '소프트웨어',
  ContactName: '담당자',
  ContactEmail: 'contact@example.com',
  ContactTEL: '01012345678',
}
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}
function requestURL(input: string | URL | Request): string {
  return input instanceof Request ? input.url : input.toString()
}
function stub(response: unknown, auth = true) {
  const fetchMock = vi.fn<typeof fetch>()
  if (auth) fetchMock.mockResolvedValueOnce(json({ session_token: 'common-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
  fetchMock.mockResolvedValueOnce(json(response))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
afterEach(() => vi.unstubAllGlobals())

describe('common HTTP contracts', () => {
  const cases: Array<{
    method: string
    args: unknown[]
    path: string
    query?: Record<string, string>
    verb?: string
    body?: unknown
    response?: unknown
    expected?: unknown
    auth?: boolean
    authHost?: boolean
    userId?: string
  }> = [
    { method: 'checkIsMember', args: [corp], path: '/Join', query: { CorpNum: corp, LID: 'COMMON_LINK' }, auth: false },
    { method: 'checkID', args: ['member/?&'], path: '/IDCheck', query: { ID: 'member/?&' }, auth: false },
    { method: 'joinMember', args: [join], path: '/Join', verb: 'POST', body: join, auth: false },
    { method: 'quitMember', args: [corp, '사용 종료', user], path: '/QuitRequest', userId: user, verb: 'POST', body: { quitReason: '사용 종료' } },
    { method: 'getCorpInfo', args: [corp, user], path: '/CorpInfo', userId: user, response: company },
    { method: 'updateCorpInfo', args: [corp, user, company], path: '/CorpInfo', userId: user, verb: 'POST', body: company },
    {
      method: 'registContact',
      args: [corp, user, { ...contact, password: 'pw' }],
      path: '/IDs/New',
      userId: user,
      verb: 'POST',
      body: { ...contact, password: 'pw' },
    },
    {
      method: 'getContactInfo',
      args: [corp, 'person"/\n', user],
      path: '/Contact',
      userId: user,
      verb: 'POST',
      body: { id: 'person"/\n' },
      response: contact,
    },
    { method: 'listContact', args: [corp, user], path: '/IDs', userId: user, response: [contact] },
    { method: 'updateContact', args: [corp, user, contact], path: '/IDs', userId: user, verb: 'POST', body: contact },
    {
      method: 'deleteContact',
      args: [corp, 'person/?&', user],
      path: '/Contact/Delete',
      query: { ContactID: 'person/?&' },
      userId: user,
      verb: 'POST',
    },
    {
      method: 'getAccessURL',
      args: [corp, user],
      path: '/Member',
      query: { TG: 'LOGIN' },
      userId: user,
      response: { url: 'https://example.com/login' },
      expected: 'https://example.com/login',
    },
    {
      method: 'getPopbillURL',
      args: [corp, user, 'LOGIN'],
      path: '/Member',
      query: { TG: 'LOGIN' },
      userId: user,
      response: { url: 'login' },
      expected: 'login',
    },
    {
      method: 'getBalance',
      args: [corp],
      path: '/POPBILL_TEST/Point',
      response: { remainPoint: '9007199254740993.123', defUsedPoint: '0' },
      expected: '9007199254740993.123',
      authHost: true,
    },
    {
      method: 'getPartnerBalance',
      args: [corp],
      path: '/POPBILL_TEST/PartnerPoint',
      response: { remainPoint: '0.00' },
      expected: '0.00',
      authHost: true,
    },
    {
      method: 'getChargeURL',
      args: [corp, user],
      path: '/Member',
      query: { TG: 'CHRG' },
      userId: user,
      response: { url: 'charge' },
      expected: 'charge',
    },
    {
      method: 'getPartnerURL',
      args: [corp, 'CHRG'],
      path: '/POPBILL_TEST/URL',
      query: { TG: 'CHRG' },
      response: { url: 'partner' },
      expected: 'partner',
      authHost: true,
    },
    {
      method: 'paymentRequest',
      args: [corp, payment, user],
      path: '/Payment',
      userId: user,
      verb: 'POST',
      body: payment,
      response: { ...result, settleCode: 'S001' },
    },
    {
      method: 'getSettleResult',
      args: [corp, 'S/001?', user],
      path: '/Payment/S%2F001%3F',
      userId: user,
      response: { settleCost: '100', settleState: 1 },
    },
    {
      method: 'getPaymentHistory',
      args: [corp, '20260101', '20260131', 2, 20, user],
      path: '/PaymentHistory',
      query: { SDate: '20260101', EDate: '20260131', Page: '2', PerPage: '20' },
      userId: user,
    },
    {
      method: 'getPaymentURL',
      args: [corp, user],
      path: '/Member',
      query: { TG: 'PAYMENT' },
      userId: user,
      response: { url: 'payment' },
      expected: 'payment',
    },
    {
      method: 'getUseHistory',
      args: [corp, '20260101', '20260131', 2, 20, 'A', user],
      path: '/UseHistory',
      query: { SDate: '20260101', EDate: '20260131', Order: 'A', Page: '2', PerPage: '20' },
      userId: user,
      response: {
        code: 1,
        message: '검색 완료',
        pageNum: 2,
        perPage: 20,
        pageCount: 1,
        total: 1,
        list: [{ itemCode: 159, serviceUserID: '025070000083', userID: 'testkorea', txPoint: '200', balance: '84923', txType: 21 }],
      },
    },
    {
      method: 'getUseHistoryURL',
      args: [corp, user],
      path: '/Member',
      query: { TG: 'USEHISTORY' },
      userId: user,
      response: { url: 'history' },
      expected: 'history',
    },
    { method: 'getRefundableBalance', args: [corp, user], path: '/RefundPoint', userId: user, response: { refundableBalance: '100.00' } },
    {
      method: 'refund',
      args: [corp, refund, user],
      path: '/Refund',
      userId: user,
      verb: 'POST',
      body: refund,
      response: { ...result, refundCode: 'R001' },
    },
    { method: 'getRefundInfo', args: [corp, 'R/001?', user], path: '/Refund/R%2F001%3F', userId: user, response: { requestPoint: '100', state: 1 } },
    { method: 'getRefundHistory', args: [corp, 2, 20, user], path: '/RefundHistory', query: { Page: '2', PerPage: '20' }, userId: user },
  ]
  for (const entry of cases)
    it(`${entry.method}`, async () => {
      const response = entry.response ?? result
      const fetchMock = stub(response, entry.auth !== false)
      const service = createCommonPromiseService(config)
      const method = Reflect.get(service, entry.method) as (...args: unknown[]) => Promise<unknown>
      expect(await method(...entry.args)).toEqual(entry.expected ?? response)
      expect(fetchMock).toHaveBeenCalledTimes(entry.auth === false ? 1 : 2)
      const [target, init] = fetchMock.mock.calls.at(-1)!
      const parsed = new URL(requestURL(target))
      expect(parsed.hostname).toBe(entry.authHost ? 'auth.linkhub.co.kr' : 'popbill-test.linkhub.co.kr')
      expect(parsed.pathname).toBe(entry.path)
      expect(Object.fromEntries(parsed.searchParams)).toEqual(entry.query ?? {})
      expect(init?.method).toBe(entry.verb ?? 'GET')
      const headers = new Headers(init?.headers)
      expect(headers.get('Authorization')).toBe(entry.auth === false ? null : 'Bearer common-token')
      expect(headers.get('x-pb-userid')).toBe(entry.userId ?? null)
      const parsedBody: unknown = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined
      expect(parsedBody).toEqual(entry.body)
      const firstCall = fetchMock.mock.calls[0]!
      const tokenBody: unknown = requestURL(firstCall[0]).endsWith('/Token') ? JSON.parse(firstCall[1]?.body as string) : undefined
      expect(tokenBody).toEqual(entry.auth === false ? undefined : { scope: ['member'], access_id: corp })
    })
})

describe('common legacy overloads and errors', () => {
  for (const method of ['updateContact', 'registContact', 'updateCorpInfo'] as const)
    it(`${method} shorter overload`, async () => {
      const payload = method === 'updateCorpInfo' ? company : method === 'registContact' ? { ...contact, password: 'pw' } : contact
      const fetchMock = stub(result)
      const service = createCommonPromiseService(config)
      await Reflect.apply(service[method], service, [corp, payload])
      expect(JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string)).toEqual(payload)
      expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get('x-pb-userid')).toBeNull()
    })
  it('callback optional user ID and error-only slots', async () => {
    stub(company)
    const service = createCommonService(config)
    const response = await new Promise((resolve, reject) => service.getCorpInfo(corp, undefined, resolve, reject))
    expect(response).toEqual(company)
    const fetchMock = stub(result)
    const error = await new Promise((resolve) => service.getCorpInfo('', undefined, resolve))
    expect(error).toMatchObject({ code: -99999999 })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('rejects malformed date without making an API request', async () => {
    const fetchMock = stub(result)
    await expect(createCommonPromiseService(config).getPaymentHistory(corp, 'bad-date', '20260131')).rejects.toMatchObject({ code: -99999999 })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('rejects partner menus outside CHRG', async () => {
    const fetchMock = stub(result)
    await expect(createCommonPromiseService(config).getPartnerURL(corp, 'LOGIN')).rejects.toMatchObject({ code: -99999999 })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('invalidates member and balance tokens after successful withdrawal', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (target) => {
      const url = requestURL(target)
      if (url.includes('/Token')) return json({ session_token: 'new-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' })
      if (url.endsWith('/Point')) return json({ remainPoint: '100' })
      if (url.endsWith('/CorpInfo')) return json(company)
      if (url.endsWith('/QuitRequest')) return json(result)
      throw new Error(`Unexpected request: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)
    const service = createCommonPromiseService(config)
    await service.getBalance(corp)
    await service.getCorpInfo(corp)
    await service.quitMember(corp, '탈퇴')
    await service.getBalance(corp)
    await service.getCorpInfo(corp)
    expect(fetchMock.mock.calls.filter(([url]) => requestURL(url).includes('/Token'))).toHaveLength(4)
  })
  it('preserves the authentication stage for point balance token failures', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(json({ code: -99999999, message: '인증 실패' }, 401))
    vi.stubGlobal('fetch', fetchMock)
    await expect(createCommonPromiseService(config).getBalance(corp)).rejects.toMatchObject({ stage: 'issue_token', message: '인증 실패' })
    expect(fetchMock).toHaveBeenCalledOnce()
  })
  it('preserves API error when default handler throws', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ session_token: 'token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
      .mockResolvedValueOnce(json({ code: -11000001, message: '오류' }, 400))
    vi.stubGlobal('fetch', fetchMock)
    await expect(
      createCommonPromiseService({
        ...config,
        defaultErrorHandler() {
          throw new Error('hook')
        },
      }).getCorpInfo(corp)
    ).rejects.toMatchObject({ code: -11000001, message: '오류' })
  })
})
