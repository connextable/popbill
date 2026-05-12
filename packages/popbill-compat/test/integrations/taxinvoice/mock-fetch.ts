const MOCK_ACCESS_URL = 'https://mock.popbill.local/taxinvoice'

export function installTaxinvoiceMockFetch(): void {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    return toJsonResponse(createMockResponseBody(input, init))
  })

  vi.stubGlobal('fetch', fetchMock)
}

function createMockResponseBody(input: RequestInfo | URL, init?: RequestInit): unknown {
  const url = toRequestUrl(input)
  const path = url.pathname
  const effectiveMethod = getEffectiveMethod(init)

  if (path.includes('/Token')) {
    return {
      session_token: 'mock-session-token',
      expiration: '2099-01-01T00:00:00Z',
      serviceID: 'POPBILL_TEST',
    }
  }

  if (path === '/Member') {
    return { url: MOCK_ACCESS_URL }
  }

  if (path === '/Taxinvoice/EmailSendConfig') {
    if (effectiveMethod === 'GET') {
      return [{ emailType: 'TAX_ISSUE', sendYN: true }]
    }

    return createOperationResult()
  }

  if (path === '/Taxinvoice/SendToNTSConfig') {
    return { sendToNTS: true }
  }

  if (path === '/Taxinvoice/Certificate') {
    return createTaxCertInfo()
  }

  if (path === '/Taxinvoice/CertCheck') {
    return createOperationResult()
  }

  if (path === '/Taxinvoice' && url.searchParams.get('cfg') === 'CERT') {
    return { certificateExpiration: '20991231235959' }
  }

  if (path.startsWith('/Taxinvoice/BULK/')) {
    return createBulkResult()
  }

  if (path.endsWith('/Files')) {
    return effectiveMethod === 'GET' ? createAttachedFiles() : createOperationResult()
  }

  if (path.includes('/Files/')) {
    return createOperationResult()
  }

  if (path.endsWith('/Logs')) {
    return createLogs()
  }

  if (path.endsWith('/AttachStmt') || path.endsWith('/DetachStmt')) {
    return createOperationResult()
  }

  if (url.search.includes('XML')) {
    return createXmlResult()
  }

  if (/^\/Taxinvoice\/(SELL|BUY|TRUSTEE)$/.test(path) && effectiveMethod === 'GET' && url.search.length > 0) {
    return createSearchResult()
  }

  if (url.search.includes('Detail')) {
    return createDetailInfo()
  }

  if (url.searchParams.has('TG') || url.search.includes('Print')) {
    return { url: MOCK_ACCESS_URL }
  }

  if (path === '/Taxinvoice' && effectiveMethod === 'BULKISSUE') {
    return createBulkSubmitResult()
  }

  if (effectiveMethod === 'ISSUE') {
    return createIssueResult()
  }

  if (/^\/Taxinvoice\/(SELL|BUY|TRUSTEE)$/.test(path) && effectiveMethod === 'POST') {
    return [createInfo()]
  }

  if (path.startsWith('/Taxinvoice/') && effectiveMethod === 'GET') {
    return createInfo()
  }

  if (path.startsWith('/Taxinvoice/')) {
    return createOperationResult()
  }

  return createOperationResult()
}

function toRequestUrl(input: RequestInfo | URL): URL {
  if (typeof input === 'string') {
    return new URL(input)
  }

  if (input instanceof URL) {
    return input
  }

  return new URL(input.url)
}

function getEffectiveMethod(init: RequestInit | undefined): string {
  return (getHeader(init?.headers, 'X-HTTP-Method-Override') ?? init?.method ?? 'GET').toUpperCase()
}

function getHeader(headers: HeadersInit | undefined, name: string): string | undefined {
  if (!headers) {
    return undefined
  }

  if (headers instanceof Headers) {
    return headers.get(name) ?? undefined
  }

  const normalizedName = name.toLowerCase()

  if (Array.isArray(headers)) {
    return headers.find(([key]) => key.toLowerCase() === normalizedName)?.[1]
  }

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === normalizedName) {
      return value
    }
  }

  return undefined
}

function toJsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
}

function createOperationResult() {
  return {
    code: 1,
    message: 'mock success',
  }
}

function createIssueResult() {
  return {
    ...createOperationResult(),
    ntsConfirmNum: '20260101-00000001',
    issueDT: '20260101120000',
  }
}

function createBulkSubmitResult() {
  return {
    ...createOperationResult(),
    receiptID: 'MOCK-RECEIPT-ID',
  }
}

function createBulkResult() {
  return {
    ...createOperationResult(),
    receiptID: 'MOCK-RECEIPT-ID',
    submitID: 'MOCK-SUBMIT-ID',
    submitCount: 1,
    successCount: 1,
    failCount: 0,
    txState: 2,
    issueResult: [
      {
        keyType: 'SELL',
        invoicerMgtKey: 'MOCK-MGT-KEY',
        code: 1,
        message: 'mock success',
      },
    ],
  }
}

function createInfo() {
  return {
    itemKey: 'MOCK-ITEM-KEY',
    mgtKey: 'MOCK-MGT-KEY',
    stateCode: 300,
  }
}

function createSearchResult() {
  return {
    ...createOperationResult(),
    total: 1,
    perPage: 100,
    pageNum: 1,
    pageCount: 1,
    list: [createInfo()],
  }
}

function createDetailInfo() {
  return {
    ...createInfo(),
    writeDate: '20260101',
    chargeDirection: '정과금',
    issueType: '정발행',
    purposeType: '영수',
    taxType: '과세',
    invoicerCorpNum: '1234567890',
    invoicerMgtKey: 'MOCK-MGT-KEY',
    invoicerCorpName: 'Mock Supplier',
    invoiceeCorpNum: '8888888888',
    invoiceeMgtKey: 'MOCK-BUYER-MGT-KEY',
    invoiceeCorpName: 'Mock Buyer',
    supplyCostTotal: '10000',
    taxTotal: '1000',
    totalAmount: '11000',
  }
}

function createXmlResult() {
  return {
    ...createOperationResult(),
    itemKey: 'MOCK-ITEM-KEY',
    mgtKey: 'MOCK-MGT-KEY',
    retObject: '<Taxinvoice />',
  }
}

function createLogs() {
  return [
    {
      docLogType: 100,
      log: 'mock log',
      procType: 'ISSUE',
      regDT: '20260101120000',
    },
  ]
}

function createAttachedFiles() {
  return [
    {
      serialNum: 1,
      attachedFile: 'MOCK-FILE-ID',
      displayName: 'mock-file.txt',
      regDT: '20260101120000',
    },
  ]
}

function createTaxCertInfo() {
  return {
    regDT: '20260101120000',
    expireDT: '20991231235959',
    issuerDN: 'CN=Mock Issuer',
    subjectDN: 'CN=Mock Subject',
    issuerName: 'Mock Issuer',
    OID: '1.2.410.200004.5.1.1.5',
    regContactName: 'Mock Contact',
    regContactID: 'mock-user',
  }
}
