import { afterEach, expect, test, vi } from 'vitest'
import * as factory from '@/factory'
import * as callback from '@/index'
import * as promise from '@/promise'
const callbackCreators = { ...callback }
const promiseCreators = { ...promise }

const config = { LinkID: 'TEST_LINK', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
const company = { corpName: '테스트 회사', ceoname: '홍길동', bizType: '서비스', bizClass: '소프트웨어', addr: '서울' }
const factories = [
  factory.createTaxinvoicePromiseService,
  factory.createCashbillPromiseService,
  factory.createStatementPromiseService,
  factory.createHTTaxinvoicePromiseService,
  factory.createHTCashbillPromiseService,
  factory.createClosedownPromiseService,
  factory.createBizInfoCheckPromiseService,
  factory.createEasyFinBankPromiseService,
  factory.createAccountCheckPromiseService,
  factory.createKakaoPromiseService,
  factory.createMessagePromiseService,
  factory.createFaxPromiseService,
]
const names = [
  'TaxinvoiceService',
  'CashbillService',
  'StatementService',
  'HTTaxinvoiceService',
  'HTCashbillService',
  'ClosedownService',
  'BizInfoCheckService',
  'EasyFinBankService',
  'AccountCheckService',
  'KakaoService',
  'MessageService',
  'FaxService',
] as const

function mockCompany() {
  const mock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(JSON.stringify({ session_token: 'test-token', expiration: '2100-01-01T00:00:00Z' })))
    .mockResolvedValueOnce(new Response(JSON.stringify(company)))
  vi.stubGlobal('fetch', mock)
  return mock
}
afterEach(() => vi.unstubAllGlobals())

test.each(factories.map((create, index) => ({ create, name: names[index] })))(
  'published factory inherits working common methods ($name)',
  async ({ create }) => {
    const mock = mockCompany()
    const service = create(config)
    await expect(service.getCorpInfo('1234567890', 'member-user')).resolves.toEqual(company)
    expect(mock.mock.calls[1]?.[0]).toBe('https://popbill-test.linkhub.co.kr/CorpInfo')
    expect(new Headers(mock.mock.calls[1]?.[1]?.headers).get('x-pb-userid')).toBe('member-user')
  }
)

test.each(names)('legacy callback and Promise %s entrypoints inherit common methods', async (name) => {
  callback.config(config)
  let mock = mockCompany()
  const result = await new Promise((resolve, reject) => callbackCreators[name]().getCorpInfo('1234567890', resolve, reject))
  expect(result).toEqual(company)
  expect(mock).toHaveBeenCalledTimes(2)
  promise.config(config)
  mock = mockCompany()
  await expect(promiseCreators[name]().getCorpInfo('1234567890')).resolves.toEqual(company)
  expect(mock).toHaveBeenCalledTimes(2)
})
