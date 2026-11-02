import { createPopbillClient } from '@/index'
import { createTaxInvoiceService, type TaxInvoiceService } from '@/services/tax-invoice'
import { TAX_INVOICE_METHODS } from '@/services/tax-invoice/methods'

const configuration = {
  linkId: 'MOCK_LINK',
  secretKey: Buffer.from('mock-secret').toString('base64'),
  userId: 'configured-user',
  isTest: true,
  useLocalTime: true,
}
const documentInput = {
  businessNumber: '1234567890',
  invoiceDocumentKeyType: 'BUY',
  invoiceManagementKey: 'INV /?#',
} as const
const operationResponse = { code: 1, message: '처리 완료' }

function createFetchMock(response: unknown, status = 200) {
  const mock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ session_token: 'mock-token', expiration: '2100-01-01T00:00:00Z' }))
    .mockResolvedValueOnce(Response.json(response, { status }))
  vi.stubGlobal('fetch', mock)
  return mock
}

function getApiRequest(mock: ReturnType<typeof createFetchMock>) {
  const [input, init] = mock.mock.calls[1]!
  return {
    url: new URL(input instanceof Request ? input.url : String(input)),
    headers: new Headers(init?.headers),
    method: init?.method,
    body: typeof init?.body === 'string' ? (JSON.parse(init.body) as unknown) : undefined,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('tax invoice SDK legacy operations through the modern public client', () => {
  const lifecycleCases = [
    ['sendInvoice', 'SEND'],
    ['cancelInvoiceSend', 'CANCELSEND'],
    ['acceptInvoice', 'ACCEPT'],
    ['denyInvoice', 'DENY'],
  ] as const

  test.each(lifecycleCases)('%s preserves document identity, memo and provider verb', async (method, verb) => {
    const fetchMock = createFetchMock(operationResponse)
    const service = createPopbillClient(configuration).services.taxInvoice
    await expect(service[method]({ ...documentInput, historyMemo: '검토 이력' })).resolves.toEqual({ resultCode: 1, resultMessage: '처리 완료' })
    const request = getApiRequest(fetchMock)
    expect(request.url.pathname).toBe('/Taxinvoice/BUY/INV%20%2F%3F%23')
    expect(request.method).toBe('POST')
    expect(request.headers.get('X-HTTP-Method-Override')).toBe(verb)
    expect(request.headers.get('X-PB-UserID')).toBe('configured-user')
    expect(request.body).toEqual({ memo: '검토 이력' })
    expect(TAX_INVOICE_METHODS).toContain(method)
  })

  test('send maps email subject without shifting the configured user slot', async () => {
    const fetchMock = createFetchMock(operationResponse)
    const service = createPopbillClient(configuration).services.taxInvoice
    await service.sendInvoice({ ...documentInput, emailSubject: '발행예정 안내' })
    const request = getApiRequest(fetchMock)
    expect(request.body).toEqual({ emailSubject: '발행예정 안내' })
    expect(request.headers.get('X-PB-UserID')).toBe('configured-user')
    expect(service).not.toHaveProperty('send')
    expect(service).not.toHaveProperty('cancelSend')
    expect(service).not.toHaveProperty('accept')
    expect(service).not.toHaveProperty('deny')
  })

  test('legacy print URL uses the SDK selector and returns a modern access URL', async () => {
    const fetchMock = createFetchMock({ url: 'https://test.popbill.com/legacy-print' })
    const service = createPopbillClient(configuration).services.taxInvoice
    await expect(service.getLegacyInvoicePrintURL(documentInput)).resolves.toEqual({ accessUrl: 'https://test.popbill.com/legacy-print' })
    const request = getApiRequest(fetchMock)
    expect(request.url.pathname).toBe('/Taxinvoice/BUY/INV%20%2F%3F%23')
    expect(request.url.searchParams.get('TG')).toBe('PRINTOLD')
    expect(request.headers.get('X-PB-UserID')).toBe('configured-user')
    expect(service).not.toHaveProperty('getOldPrintURL')
    expect(TAX_INVOICE_METHODS).toContain('getLegacyInvoicePrintURL')
  })

  test.each([null, ['opaque-key'], { arbitraryProviderField: { version: 3, value: 'opaque' } }])(
    'email public keys preserve unmodeled provider response %j',
    async (response) => {
      const fetchMock = createFetchMock(response)
      const service = createPopbillClient(configuration).services.taxInvoice
      await expect(service.getEmailPublicKeys({ businessNumber: documentInput.businessNumber })).resolves.toEqual({ publicKeys: response })
      const request = getApiRequest(fetchMock)
      expect(request.url.pathname).toBe('/Taxinvoice/EmailPublicKeys')
      expect(request.headers.get('X-PB-UserID')).toBe('configured-user')
      expect(TAX_INVOICE_METHODS).toContain('getEmailPublicKeys')
    }
  )

  test('an opaque in-memory public key result stays opaque without an invented schema', async () => {
    type Compat = Parameters<typeof createTaxInvoiceService>[0]['compatTaxInvoiceService']
    const rawResponse = { keys: [{ newField: 'preserve' }] }
    const compat = { getEmailPublicKeys: vi.fn<Compat['getEmailPublicKeys']>().mockResolvedValue(rawResponse) } as unknown as Compat
    const service = createTaxInvoiceService({ compatTaxInvoiceService: compat, defaultUserId: 'configured-user' })
    const result = await service.getEmailPublicKeys({ businessNumber: documentInput.businessNumber })
    expect(result.publicKeys).toBe(rawResponse)
  })

  test('new operations use the modern error operation and notify once', async () => {
    const onError = vi.fn<(error: unknown) => void>()
    createFetchMock({ code: -11000005, message: '문서가 없습니다.' }, 400)
    const service: TaxInvoiceService = createPopbillClient({ ...configuration, onError }).services.taxInvoice
    await expect(service.acceptInvoice(documentInput)).rejects.toMatchObject({ code: -11000005, operation: 'taxInvoice.acceptInvoice' })
    expect(onError).toHaveBeenCalledTimes(1)
  })
})
