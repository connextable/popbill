import { afterEach, expect, test, vi } from 'vitest'
import { createPopbillClient, type PopbillClient } from '@/index'

const businessNumber = '1234567890'
const config = { linkId: 'TEST_LINK', secretKey: Buffer.from('secret').toString('base64'), userId: 'default-user', isTest: true }
const charge = { unitCost: '10.50', chargeMethod: '종량제', rateSystem: '정액' }
function requestUrl(input: Parameters<typeof fetch>[0]): string {
  return typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
}
function requestBody(input: RequestInit | undefined): unknown {
  if (typeof input?.body !== 'string') throw new Error('Expected a serialized JSON request body.')
  return JSON.parse(input.body) as unknown
}
interface ServiceCase {
  name: keyof PopbillClient['services']
  path: string
  scopes: string[]
  call: (client: PopbillClient) => Promise<unknown>
}
const cases: ServiceCase[] = [
  { name: 'common', path: '/CorpInfo', scopes: ['member'], call: (c) => c.services.common.getCompanyInfo({ businessNumber }) },
  {
    name: 'taxInvoice',
    path: '/Taxinvoice/ChargeInfo',
    scopes: ['member', '110'],
    call: (c) => c.services.taxInvoice.getChargeInfo({ businessNumber }),
  },
  {
    name: 'cashbill',
    path: '/Cashbill/ChargeInfo',
    scopes: ['member', '140'],
    call: (c) => c.services.cashbill.getChargeInfo({ businessNumber }),
  },
  {
    name: 'statement',
    path: '/Statement/ChargeInfo/121',
    scopes: ['member', '121', '122', '123', '124', '125', '126'],
    call: (c) => c.services.statement.getChargeInfo({ businessNumber, documentTypeCode: 121 }),
  },
  {
    name: 'homeTaxTaxInvoice',
    path: '/HomeTax/Taxinvoice/ChargeInfo',
    scopes: ['member', '111'],
    call: (c) => c.services.homeTaxTaxInvoice.getChargeInfo({ businessNumber }),
  },
  {
    name: 'homeTaxCashbill',
    path: '/HomeTax/Cashbill/ChargeInfo',
    scopes: ['member', '141'],
    call: (c) => c.services.homeTaxCashbill.getChargeInfo({ businessNumber }),
  },
  {
    name: 'closedown',
    path: '/CloseDown/ChargeInfo',
    scopes: ['member', '170'],
    call: (c) => c.services.closedown.getChargeInfo({ businessNumber }),
  },
  {
    name: 'bizInfoCheck',
    path: '/BizInfo/ChargeInfo',
    scopes: ['member', '171'],
    call: (c) => c.services.bizInfoCheck.getChargeInfo({ businessNumber }),
  },
  {
    name: 'easyFinBank',
    path: '/EasyFin/Bank/ChargeInfo',
    scopes: ['member', '180'],
    call: (c) => c.services.easyFinBank.getChargeInfo({ businessNumber }),
  },
  {
    name: 'accountCheck',
    path: '/EasyFin/AccountCheck/ChargeInfo',
    scopes: ['member', '182', '183'],
    call: (c) => c.services.accountCheck.getChargeInfo({ businessNumber }),
  },
  {
    name: 'kakao',
    path: '/KakaoTalk/ChargeInfo?Type=ATS',
    scopes: ['member', '153', '154', '155', '156', '157', '158', '159'],
    call: (c) => c.services.kakao.getMessageChargeInfo({ businessNumber, messageType: 'ATS' }),
  },
  {
    name: 'message',
    path: '/Message/ChargeInfo?Type=SMS',
    scopes: ['member', '150', '151', '152'],
    call: (c) => c.services.message.getChargeInfo({ businessNumber, messageType: 'SMS' }),
  },
  {
    name: 'fax',
    path: '/FAX/ChargeInfo?receiveNumType=%EC%9D%BC%EB%B0%98',
    scopes: ['member', '160', '161'],
    call: (c) => c.services.fax.getChargeInfo({ businessNumber }),
  },
]

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test.each(cases)('public $name service reaches its provider with isolated scopes and client settings', async (entry) => {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(JSON.stringify({ session_token: 'test-token', expiration: '2100-01-01T00:00:00Z' })))
    .mockResolvedValueOnce(new Response(JSON.stringify(charge)))
  vi.stubGlobal('fetch', fetchMock)
  const client = createPopbillClient({ ...config, acceptLanguage: 'en-US', acceptEncoding: null, requestTimeoutMs: 5000 })
  expect(fetchMock).not.toHaveBeenCalled()
  await entry.call(client)
  expect(fetchMock).toHaveBeenCalledTimes(2)
  const [tokenUrl, tokenInit] = fetchMock.mock.calls[0]!
  expect(requestUrl(tokenUrl)).toContain('/POPBILL_TEST/Token')
  expect(requestBody(tokenInit)).toMatchObject({ access_id: businessNumber, scope: entry.scopes })
  const [apiUrl, apiInit] = fetchMock.mock.calls[1]!
  expect(requestUrl(apiUrl)).toBe(`https://popbill-test.linkhub.co.kr${entry.path}`)
  const headers = new Headers(apiInit?.headers)
  expect(headers.get('Authorization')).toBe('Bearer test-token')
  expect(headers.get('x-pb-userid')).toBe('default-user')
  expect(headers.get('Accept-Language')).toBe('en-US')
  expect(headers.has('Accept-Encoding')).toBe(false)
})

test('errors from a newly registered service reach the client hook once', async () => {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(JSON.stringify({ session_token: 'test-token', expiration: '2100-01-01T00:00:00Z' })))
    .mockResolvedValueOnce(new Response(JSON.stringify({ code: -17000001, message: 'provider error' }), { status: 400 }))
  vi.stubGlobal('fetch', fetchMock)
  const onError = vi.fn<(error: unknown) => void>()
  const client = createPopbillClient({ ...config, onError })
  await expect(client.services.closedown.getChargeInfo({ businessNumber })).rejects.toMatchObject({ code: -17000001 })
  expect(onError).toHaveBeenCalledTimes(1)
})

test.each([
  { printCopy: 'supplier', value: '1' },
  { printCopy: 'buyer', value: '2' },
] as const)('PDF $printCopy selection crosses the public client and compat boundary without losing bytes', async ({ printCopy, value }) => {
  const bytes = new Uint8Array([37, 80, 68, 70, 0, 128, 255])
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(JSON.stringify({ session_token: 'test-token', expiration: '2100-01-01T00:00:00Z' })))
    .mockResolvedValueOnce(new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } }))
  vi.stubGlobal('fetch', fetchMock)
  const result = await createPopbillClient(config).services.taxInvoice.downloadInvoicePDF({
    businessNumber,
    invoiceDocumentKeyType: 'SELL',
    invoiceManagementKey: 'PDF-001',
    printCopy,
  })
  const url = new URL(requestUrl(fetchMock.mock.calls[1]![0]))
  expect(url.pathname).toBe('/Taxinvoice/SELL/PDF-001')
  expect(url.searchParams.has('PDF')).toBe(true)
  expect(url.searchParams.get('PdfInvoiceType')).toBe(value)
  expect(result.fileData).toEqual(bytes)
})
