/* oxlint-disable vitest/no-conditional-expect -- Each HTTP matrix row declares the applicable request assertions. */
import { createHash } from 'node:crypto'
import { createCashbillPromiseService, createCashbillService } from '@/services/cashbill'
import { CASHBILL_METHODS } from '@/services/cashbill/methods'
import type { CompatConfig } from '@/config'

const corpNum = '1234567890'
const userId = 'cash-user'
const key = 'cash/key?1'
const path = '/Cashbill/cash%2Fkey%3F1'
const ok = { code: 1, message: 'Success' }
const link = 'https://test.popbill.com/cashbill'
const issued = { ...ok, confirmNum: '123456789', tradeDate: '20261103', tradeDT: '20261103120000' }
const document = {
  mgtKey: 'CASH-001',
  tradeType: '승인거래' as const,
  tradeUsage: '소득공제용' as const,
  taxationType: '과세' as const,
  totalAmount: '11000',
  supplyCost: '10000',
  tax: '1000',
  serviceFee: '0',
  franchiseCorpNum: corpNum,
  identityNum: '0100001234',
  smssendYN: false,
}
const config: CompatConfig = { LinkID: 'TEST_LINK', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }

interface Case {
  method: (typeof CASHBILL_METHODS)[number]
  args: unknown[]
  path: string
  override?: string
  body?: unknown
  query?: Record<string, string>
  response: unknown
  expected?: unknown
  user?: boolean
  form?: string
  pdf?: boolean
}

const cases: Case[] = [
  { method: 'getUnitCost', args: [], path: '/Cashbill', query: { cfg: 'UNITCOST' }, response: { unitCost: '10' }, expected: '10' },
  {
    method: 'getChargeInfo',
    args: [userId],
    path: '/Cashbill/ChargeInfo',
    response: { unitCost: '10', chargeMethod: '연동', rateSystem: '종량제' },
    user: true,
  },
  { method: 'getURL', args: ['PBOX', userId], path: '/Cashbill', query: { TG: 'PBOX' }, response: { url: link }, expected: link, user: true },
  { method: 'checkMgtKeyInUse', args: [key, userId], path, response: { itemKey: 'ITEM' }, expected: true, user: true },
  { method: 'register', args: [document, userId], path: '/Cashbill', override: 'POST', body: document, response: ok, user: true },
  { method: 'update', args: [key, document, userId], path, override: 'PATCH', body: document, response: ok, user: true },
  { method: 'delete', args: [key, userId], path, override: 'DELETE', response: ok, user: true },
  { method: 'issue', args: [key, '발행', userId], path, override: 'ISSUE', body: { memo: '발행' }, response: issued, user: true },
  { method: 'cancelIssue', args: [key, '취소', userId], path, override: 'CANCELISSUE', body: { memo: '취소' }, response: ok, user: true },
  {
    method: 'sendEmail',
    args: [key, 'buyer@example.test', userId],
    path,
    override: 'EMAIL',
    body: { receiver: 'buyer@example.test' },
    response: ok,
    user: true,
  },
  {
    method: 'sendSMS',
    args: [key, '07012345678', '01012345678', '발행 안내', userId],
    path,
    override: 'SMS',
    body: { sender: '07012345678', receiver: '01012345678', contents: '발행 안내' },
    response: ok,
    user: true,
  },
  {
    method: 'sendFAX',
    args: [key, '07012345678', '0212345678', userId],
    path,
    override: 'FAX',
    body: { sender: '07012345678', receiver: '0212345678' },
    response: ok,
    user: true,
  },
  { method: 'getDetailInfo', args: [key, userId], path, query: { Detail: '' }, response: document, user: true },
  { method: 'getInfo', args: [key, userId], path, response: { ...document, stateCode: 304 }, user: true },
  {
    method: 'getInfos',
    args: [['CASH-001', 'CASH-002'], userId],
    path: '/Cashbill/States',
    override: 'POST',
    body: ['CASH-001', 'CASH-002'],
    response: [document],
    user: true,
  },
  { method: 'getLogs', args: [key, userId], path: `${path}/Logs`, response: [{ docLogType: 1, procMemo: '처리' }], user: true },
  { method: 'getPDFURL', args: [key, userId], path, query: { TG: 'PDF' }, response: { url: link }, expected: link, user: true },
  { method: 'getPrintURL', args: [key, userId], path, query: { TG: 'PRINT' }, response: { url: link }, expected: link, user: true },
  { method: 'getEPrintURL', args: [key, userId], path, query: { TG: 'EPRINT' }, response: { url: link }, expected: link, user: true },
  {
    method: 'getMassPrintURL',
    args: [['CASH-001'], userId],
    path: '/Cashbill/Prints',
    override: 'POST',
    body: ['CASH-001'],
    response: { url: link },
    expected: link,
    user: true,
  },
  { method: 'getMailURL', args: [key, userId], path, query: { TG: 'MAIL' }, response: { url: link }, expected: link, user: true },
  { method: 'getPopUpURL', args: [key, userId], path, query: { TG: 'POPUP' }, response: { url: link }, expected: link, user: true },
  { method: 'getViewURL', args: [key, userId], path, query: { TG: 'VIEW' }, response: { url: link }, expected: link, user: true },
  { method: 'getPDF', args: [key, userId], path, query: { PDF: '' }, response: '%PDF-1.7\nbytes', pdf: true, user: true },
  {
    method: 'registIssue',
    args: [document, '메모', userId, '제목'],
    path: '/Cashbill',
    override: 'ISSUE',
    body: { ...document, memo: '메모', emailSubject: '제목' },
    response: issued,
    user: true,
  },
  {
    method: 'bulkSubmit',
    args: ['SUBMIT-001', [document], userId],
    path: '/Cashbill',
    override: 'BULKISSUE',
    body: { cashbills: [document] },
    response: { ...ok, receiptID: 'RECEIPT-001' },
    user: true,
  },
  {
    method: 'getBulkResult',
    args: ['SUBMIT-001', userId],
    path: '/Cashbill/BULK/SUBMIT-001/State',
    response: { ...ok, txState: 2, receiptDT: '20261103120000', issueResult: [{ ...issued, mgtKey: 'CASH-001', issueDT: '20261103120001' }] },
    user: true,
  },
  {
    method: 'revokeRegistIssue',
    args: [key, '123456789', '20261103', false, '취소', userId, true, 1, '1000', '100', '0', '1100', '취소제목', '20261103120000'],
    path: '/Cashbill',
    override: 'REVOKEISSUE',
    body: {
      mgtKey: key,
      orgConfirmNum: '123456789',
      orgTradeDate: '20261103',
      smssendYN: false,
      memo: '취소',
      isPartCancel: true,
      cancelType: 1,
      supplyCost: '1000',
      tax: '100',
      serviceFee: '0',
      totalAmount: '1100',
      emailSubject: '취소제목',
      tradeDT: '20261103120000',
    },
    response: issued,
    user: true,
  },
  {
    method: 'revokeRegister',
    args: [key, '123456789', '20261103', false, userId, true, 1, '1000', '100', '0', '1100'],
    path: '/Cashbill',
    override: 'REVOKE',
    body: {
      mgtKey: key,
      orgConfirmNum: '123456789',
      orgTradeDate: '20261103',
      smssendYN: false,
      isPartCancel: true,
      cancelType: 1,
      supplyCost: '1000',
      tax: '100',
      serviceFee: '0',
      totalAmount: '1100',
    },
    response: ok,
    user: true,
  },
  {
    method: 'search',
    args: ['T', '20261101', '20261103', ['3**'], ['N'], ['P'], ['N', 'B'], ['T'], '010&123', 'D', 2, 100, '0001,0002', userId],
    path: '/Cashbill/Search',
    query: {
      DType: 'T',
      SDate: '20261101',
      EDate: '20261103',
      State: '3**',
      TradeType: 'N',
      TradeUsage: 'P',
      TradeOpt: 'N,B',
      TaxationType: 'T',
      QString: '010&123',
      Order: 'D',
      Page: '2',
      PerPage: '100',
      FranchiseTaxRegID: '0001,0002',
    },
    response: { ...ok, total: 1, list: [document] },
    user: true,
  },
  { method: 'listEmailConfig', args: [userId], path: '/Cashbill/EmailSendConfig', response: [{ emailType: 'CSH_ISSUE', sendYN: false }], user: true },
  {
    method: 'updateEmailConfig',
    args: ['CSH_ISSUE', false, userId],
    path: '/Cashbill/EmailSendConfig',
    override: 'POST',
    query: { EmailType: 'CSH_ISSUE', SendYN: 'false' },
    response: ok,
    user: true,
  },
  {
    method: 'assignMgtKey',
    args: ['ITEM/001', key, userId],
    path: '/Cashbill/ITEM%2F001',
    override: 'POST',
    form: 'MgtKey=cash%2Fkey%3F1',
    response: ok,
    user: true,
  },
]

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
}
function stubResponse(test: Case) {
  const mock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(json({ session_token: 'cash-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
  mock.mockResolvedValueOnce(
    test.pdf ? new Response(test.response as string, { headers: { 'Content-Type': 'application/pdf;charset=utf-8' } }) : json(test.response)
  )
  vi.stubGlobal('fetch', mock)
  return mock
}
function invoke(service: object, method: string, args: unknown[]): unknown {
  return Reflect.apply(Reflect.get(service, method) as (...values: unknown[]) => unknown, service, args)
}

afterEach(() => vi.unstubAllGlobals())

describe('Cashbill raw HTTP contracts', () => {
  it('covers every public legacy method', () => expect(cases.map((test) => test.method).sort()).toEqual([...CASHBILL_METHODS].sort()))
  for (const mode of ['promise', 'callback'] as const) {
    it.each(cases)(`${mode}: $method`, async (test) => {
      const mock = stubResponse(test)
      const args = [corpNum, ...test.args]
      const response =
        mode === 'promise'
          ? await invoke(createCashbillPromiseService(config), test.method, args)
          : await new Promise((resolve, reject) => {
              invoke(createCashbillService(config), test.method, [...args, resolve, reject])
            })
      expect(response).toEqual(test.pdf ? Buffer.from(test.response as string) : (test.expected ?? test.response))
      expect(mock).toHaveBeenCalledTimes(2)
      const tokenBody = JSON.parse(mock.mock.calls[0]![1]!.body as string)
      expect(tokenBody.scope).toEqual(['member', '140'])
      const [target, init] = mock.mock.calls[1]!
      const url = new URL(target instanceof Request ? target.url : String(target))
      expect(url.pathname).toBe(test.path)
      expect(Object.fromEntries(url.searchParams)).toEqual(test.query ?? {})
      expect(init?.method).toBe(test.override ? 'POST' : 'GET')
      const headers = new Headers(init?.headers)
      expect(headers.get('Authorization')).toBe('Bearer cash-token')
      expect(headers.get('x-pb-userid')).toBe(test.user ? userId : null)
      expect(headers.get('X-HTTP-Method-Override')).toBe(test.override && test.override !== 'POST' ? test.override : null)
      if (test.body !== undefined) expect(JSON.parse(init?.body as string)).toEqual(test.body)
      if (test.form !== undefined) {
        expect(init?.body).toBe(test.form)
        expect(headers.get('Content-Type')).toBe('application/x-www-form-urlencoded; charset=utf-8')
      }
      if (test.override === 'BULKISSUE') {
        expect(headers.get('X-PB-SUBMIT-ID')).toBe('SUBMIT-001')
        expect(headers.get('X-PB-MESSAGE-DIGEST')).toBe(
          createHash('sha1')
            .update(init?.body as string)
            .digest('base64')
        )
      }
    })
  }
})

describe('Cashbill failure and overload behavior', () => {
  it('distinguishes an undefined UserID with two callback slots from an error-only callback', async () => {
    stubResponse({ method: 'getInfo', args: [], path, response: { itemKey: 'ITEM', stateCode: 304 } })
    await expect(
      new Promise((resolve) => {
        createCashbillService(config).getInfo(corpNum, key, undefined, resolve, undefined)
      })
    ).resolves.toEqual({ itemKey: 'ITEM', stateCode: 304 })
    const apiError = { code: -14000003, message: '문서 없음' }
    const mock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ session_token: 'token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
      .mockResolvedValueOnce(json(apiError, 400))
    vi.stubGlobal('fetch', mock)
    await expect(
      new Promise((resolve) => {
        createCashbillService(config).getInfo(corpNum, key, undefined, resolve)
      })
    ).resolves.toMatchObject(apiError)
  })
  it.each([undefined, null])('missing itemKey %s returns false', async (itemKey) => {
    stubResponse({ method: 'checkMgtKeyInUse', args: [], path, response: { itemKey } })
    await expect(createCashbillPromiseService(config).checkMgtKeyInUse(corpNum, key)).resolves.toBe(false)
  })
  it.each([
    [['T'], 'D', 1, 100],
    [['T'], 'query', 'D', 1, 100],
    [['B'], ['T'], 'query', 'D', 1, 100],
    [['B'], ['T'], 'query', 'D', 1, 100, '0001'],
    [['B'], ['T'], 'query', 'D', 1, 100, '0001', userId],
  ])('preserves historical search option positions (%j)', async (...options) => {
    const mock = stubResponse({ method: 'search', args: [], path, response: { ...ok, list: [] } })
    await invoke(createCashbillPromiseService(config), 'search', [corpNum, 'T', '20261101', '20261103', [], ['N'], ['P'], ...options])
    const target = mock.mock.calls[1]![0]
    const url = new URL(target instanceof Request ? target.url : target)
    expect(url.searchParams.get('TaxationType')).toBe('T')
    expect(url.searchParams.get('Order')).toBe('D')
    expect(url.searchParams.get('Page')).toBe('1')
    expect(url.searchParams.get('PerPage')).toBe('100')
    expect(url.searchParams.get('TradeOpt')).toBe(options.length > 5 ? 'B' : null)
  })
  it('normalizes partial revocation overload without UserID', async () => {
    const mock = stubResponse({ method: 'revokeRegistIssue', args: [], path, response: issued })
    await createCashbillPromiseService(config).revokeRegistIssue(
      corpNum,
      'REVOKE',
      '123456789',
      '20261103',
      false,
      '부분 취소',
      true,
      1,
      '1000',
      '100',
      '0',
      '1100'
    )
    expect(JSON.parse(mock.mock.calls[1]![1]!.body as string)).toEqual({
      mgtKey: 'REVOKE',
      orgConfirmNum: '123456789',
      orgTradeDate: '20261103',
      smssendYN: false,
      memo: '부분 취소',
      isPartCancel: true,
      cancelType: 1,
      supplyCost: '1000',
      tax: '100',
      serviceFee: '0',
      totalAmount: '1100',
    })
  })
  it('does not mutate the document or discard server transaction timestamps', async () => {
    const original = structuredClone(document)
    stubResponse({ method: 'registIssue', args: [], path, response: issued })
    await expect(createCashbillPromiseService(config).registIssue(corpNum, Object.freeze(original), 'memo')).resolves.toEqual(issued)
    expect(original).toEqual(document)
  })
  it('rejects empty bulk batches before authentication', async () => {
    const mock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', mock)
    const service = createCashbillPromiseService(config)
    await expect(service.bulkSubmit(corpNum, 'SUBMIT', [])).rejects.toMatchObject({ code: -99999999 })
    expect(mock).not.toHaveBeenCalled()
  })
  it('leaves bulk batch-size limits to the provider without splitting', async () => {
    const mock = stubResponse({ method: 'bulkSubmit', args: [], path: '/Cashbill', response: ok })
    const documents = Array.from({ length: 101 }, () => document)

    await createCashbillPromiseService(config).bulkSubmit(corpNum, 'SUBMIT-101', documents)

    expect(mock).toHaveBeenCalledTimes(2)
    expect(JSON.parse(mock.mock.calls[1]![1]!.body as string).cashbills).toEqual(documents)
  })
  it('delivers server errors to callback error and promise rejection', async () => {
    const apiError = { code: -14000003, message: '현금영수증이 존재하지 않습니다.' }
    for (const callback of [false, true]) {
      const mock = vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(json({ session_token: 'token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
        .mockResolvedValueOnce(json(apiError, 400))
      vi.stubGlobal('fetch', mock)
      if (callback)
        await new Promise<void>((resolve, reject) => {
          createCashbillService(config).getInfo(
            corpNum,
            key,
            () => reject(new Error('unexpected success')),
            (error) => {
              expect(error).toMatchObject(apiError)
              resolve()
            }
          )
        })
      else await expect(createCashbillPromiseService(config).getInfo(corpNum, key)).rejects.toMatchObject(apiError)
    }
  })
})
