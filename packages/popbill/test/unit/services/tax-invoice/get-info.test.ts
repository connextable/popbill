import { PopbillErrorStage, PopbillErrorType, createPopbillClient } from '@/index'

const CLIENT_CONFIG = {
  linkId: 'TEST_LINK_ID',
  secretKey: Buffer.from('secret').toString('base64'),
  userId: 'test-user',
  isTest: true,
  useLocalTime: true,
}
const GET_INFO_INPUT = {
  businessNumber: '1234567890',
  invoiceDocumentKeyType: 'SELL',
  invoiceManagementKey: '20260224-001',
} as const
const TOKEN_RESPONSE = {
  session_token: 'session-token',
  expiration: '2099-01-01T00:00:00Z',
  serviceID: 'POPBILL_TEST',
}
const INVOICE_INFO_RESPONSE = {
  itemKey: '123456789012345678',
  taxType: '과세',
  writeDate: '20260224',
  regDT: '20260224103030',
  issueType: '정발행',
  supplyCostTotal: '10000',
  taxTotal: '1000',
  purposeType: '영수',
  issueDT: '20260224103030',
  lateIssueYN: 'false',
  openYN: false,
  stateMemo: '',
  stateCode: 3,
  stateDT: '20260224103030',
  interOPYN: true,
  invoicerCorpName: '공급자',
  invoicerCorpNum: '1234567890',
  invoicerPrintYN: false,
  invoiceeCorpName: '공급받는자',
  invoiceeCorpNum: '8888888888',
  invoiceePrintYN: false,
}

function stubSuccessfulFetch(serviceId = 'POPBILL_TEST') {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ ...TOKEN_RESPONSE, serviceID: serviceId }))
    .mockResolvedValueOnce(Response.json(INVOICE_INFO_RESPONSE))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('tax-invoice getInvoiceInfo', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('authenticates and maps an invoice through the public client', async () => {
    const fetchMock = stubSuccessfulFetch()
    const client = createPopbillClient(CLIENT_CONFIG)

    expect(await client.services.taxInvoice.getInvoiceInfo(GET_INFO_INPUT)).toMatchObject({
      itemKey: '123456789012345678',
      taxType: '과세',
      writtenDate: '20260224',
      registeredAt: '20260224103030',
      issueType: '정발행',
      totalSupplyCost: '10000',
      totalTax: '1000',
      purposeType: '영수',
      issuedAt: '20260224103030',
      isLateIssued: false,
      isOpen: false,
      stateMemo: '',
      stateCode: 3,
      stateChangedAt: '20260224103030',
      isApiLinkedDocument: true,
      supplierCompanyName: '공급자',
      supplierBusinessNumber: '1234567890',
      isSupplierPrinted: false,
      buyerCompanyName: '공급받는자',
      buyerBusinessNumber: '8888888888',
      isBuyerPrinted: false,
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(getFetchRequestUrl(fetchMock, 0)).toBe('https://auth.linkhub.co.kr/POPBILL_TEST/Token')
    expect(getFetchRequestUrl(fetchMock, 1)).toBe('https://popbill-test.linkhub.co.kr/Taxinvoice/SELL/20260224-001')
    const headers = fetchMock.mock.calls[1]?.[1]?.headers as Record<string, string>
    expect(headers).toMatchObject({ Authorization: 'Bearer session-token', 'Accept-Encoding': 'gzip' })
    expect(headers).not.toHaveProperty('Accept-Language')
  })

  test.each([
    { config: { acceptLanguage: 'en-US' }, header: 'Accept-Language', value: 'en-US' },
    { config: { acceptEncoding: 'br' }, header: 'Accept-Encoding', value: 'br' },
  ])('forwards configured $header', async ({ config, header, value }) => {
    const fetchMock = stubSuccessfulFetch()
    await createPopbillClient({ ...CLIENT_CONFIG, ...config }).services.taxInvoice.getInvoiceInfo(GET_INFO_INPUT)

    const headers = fetchMock.mock.calls[1]?.[1]?.headers as Record<string, string>
    expect(headers[header]).toBe(value)
  })

  test('defaults to the production authentication and API hosts', async () => {
    const fetchMock = stubSuccessfulFetch('POPBILL')
    await createPopbillClient({ ...CLIENT_CONFIG, isTest: undefined }).services.taxInvoice.getInvoiceInfo(GET_INFO_INPUT)

    expect(getFetchRequestUrl(fetchMock, 0)).toBe('https://auth.linkhub.co.kr/POPBILL/Token')
    expect(getFetchRequestUrl(fetchMock, 1)).toBe('https://popbill.linkhub.co.kr/Taxinvoice/SELL/20260224-001')
  })

  test('rejects invalid input before requesting the network and notifies onError', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    const onError = vi.fn<(error: unknown) => void>()
    const client = createPopbillClient({ ...CLIENT_CONFIG, onError })
    const expectedError = {
      code: -99999999,
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
      operation: 'taxInvoice.getInvoiceInfo',
    }

    await expect(client.services.taxInvoice.getInvoiceInfo({ ...GET_INFO_INPUT, businessNumber: '' })).rejects.toMatchObject(expectedError)
    expect(onError).toHaveBeenCalledExactlyOnceWith(expect.objectContaining(expectedError))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('normalizes authentication failure and notifies onError', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ code: -11000000, message: 'Authentication denied' }, { status: 401 }))
    vi.stubGlobal('fetch', fetchMock)
    const onError = vi.fn<(error: unknown) => void>()
    const client = createPopbillClient({ ...CLIENT_CONFIG, onError })
    const expectedError = {
      code: -11000000,
      message: 'Authentication denied',
      type: PopbillErrorType.ApiResponse,
      stage: PopbillErrorStage.IssueToken,
      operation: 'taxInvoice.getInvoiceInfo',
      status: 401,
    }

    await expect(client.services.taxInvoice.getInvoiceInfo(GET_INFO_INPUT)).rejects.toMatchObject(expectedError)
    expect(onError).toHaveBeenCalledExactlyOnceWith(expect.objectContaining(expectedError))
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

function getFetchRequestUrl(fetchMock: ReturnType<typeof vi.fn<typeof fetch>>, callIndex: number): string {
  const requestInput = fetchMock.mock.calls[callIndex]?.[0]
  if (typeof requestInput === 'string') return requestInput
  if (requestInput instanceof URL) return requestInput.toString()
  return requestInput?.url ?? ''
}
