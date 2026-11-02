import { createStatementPromiseService, createStatementService, type CompatConfig } from '@/factory/index'

export { createStatementPromiseService, createStatementService }

export const CORP_NUM = '1234567890'
export const USER_ID = 'statement-user'
export const MGT_KEY = 'STMT/001?x'
export const DOCUMENT_PATH = '/Statement/121/STMT%2F001%3Fx'

export function config(defaultErrorHandler?: (error: unknown) => void): CompatConfig {
  return {
    LinkID: 'TEST_LINK_ID',
    SecretKey: Buffer.from('secret').toString('base64'),
    IsTest: true,
    defaultErrorHandler,
  }
}

export function document() {
  return {
    itemCode: 121 as const,
    mgtKey: 'STMT-001',
    writeDate: '20261102',
    purposeType: '영수' as const,
    taxType: '과세' as const,
    senderCorpNum: CORP_NUM,
    senderCorpName: '공급자',
    senderCEOName: '대표자',
    receiverCorpNum: '8888888888',
    receiverCorpName: '공급받는자',
    receiverCEOName: '수신자',
    supplyCostTotal: '20000',
    taxTotal: '2000',
    totalAmount: '22000',
    businessLicenseYN: false,
    bankBookYN: false,
    smssendYN: false,
    detailList: [{ serialNum: 1, itemName: '상품', qty: '1', supplyCost: '20000', tax: '2000' }],
    propertyBag: { Balance: '2000', Deposit: '500', CBalance: '2500' },
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json;charset=utf-8' } })
}

export function stubApiResponse(body: unknown, status = 200) {
  const fetchMock = vi.fn<typeof fetch>()
  fetchMock.mockResolvedValueOnce(jsonResponse({ session_token: 'statement-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
  fetchMock.mockResolvedValueOnce(jsonResponse(body, status))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export function apiRequest(fetchMock: ReturnType<typeof vi.fn<typeof fetch>>) {
  expect(fetchMock).toHaveBeenCalledTimes(2)
  const target = fetchMock.mock.calls[1]?.[0]
  return {
    url: new URL(target instanceof Request ? target.url : (target ?? '')),
    init: fetchMock.mock.calls[1]?.[1] as RequestInit,
  }
}

export function invoke(service: object, method: string, args: unknown[]): unknown {
  const target: unknown = Reflect.get(service, method)
  if (typeof target !== 'function') {
    throw new Error(`Missing StatementService.${method}`)
  }
  return Reflect.apply(target, service, args)
}
