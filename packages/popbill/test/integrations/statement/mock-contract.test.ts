import { expectTypeOf } from 'vitest'
import { createPopbillClient, type ResendStatementSMSInput } from '@/index'

const BUSINESS_NUMBER = '1234567890'
const DOCUMENT_KEY = { businessNumber: BUSINESS_NUMBER, documentTypeCode: 121, managementKey: 'STMT/001?x' } as const
const DOCUMENT_PATH = '/Statement/121/STMT%2F001%3Fx'
const CONFIG = { linkId: 'MOCK_LINK_ID', secretKey: Buffer.from('mock-secret').toString('base64'), userId: 'statement-user', useLocalTime: true }

function requestUrl(input: Parameters<typeof fetch>[0]): URL {
  return new URL(input instanceof Request ? input.url : String(input))
}

describe('statement client and HTTP mock contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('requires SMS contents in the public input and sends the supplied text', async () => {
    // Both official HTTP and Node contracts require Contents; no default message is defined.
    expectTypeOf<Pick<ResendStatementSMSInput, 'messageBody'>>().toEqualTypeOf<{ messageBody: string }>()
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ session_token: 'statement-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
      .mockResolvedValueOnce(Response.json({ code: 1, message: '문자 전송 완료' }))
    vi.stubGlobal('fetch', fetchMock)
    const service = createPopbillClient({ ...CONFIG, isTest: true }).services.statement

    await expect(
      service.resendStatementSMS({
        ...DOCUMENT_KEY,
        senderPhoneNumber: '07043042991',
        receiverPhoneNumber: '01012345678',
        messageBody: '거래명세서를 확인해 주세요.',
      })
    ).resolves.toMatchObject({ resultCode: 1 })

    expect(JSON.parse(fetchMock.mock.calls[1]![1]!.body as string)).toEqual({
      sender: '07043042991',
      receiver: '01012345678',
      contents: '거래명세서를 확인해 주세요.',
    })
  })

  test('serializes and maps a complete document lifecycle through real SDK layers', async () => {
    const ok = { code: 1, message: 'mock success' }
    const info = {
      itemKey: 'ITEM-001',
      itemCode: 121,
      mgtKey: DOCUMENT_KEY.managementKey,
      stateCode: 300,
      supplyCostTotal: '00020.50',
      taxTotal: '0',
      openYN: false,
    }
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ session_token: 'statement-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
      .mockResolvedValueOnce(Response.json(ok))
      .mockResolvedValueOnce(Response.json(ok))
      .mockResolvedValueOnce(Response.json(ok))
      .mockResolvedValueOnce(Response.json(info))
      .mockResolvedValueOnce(Response.json({ ...ok, total: 1, list: [info] }))
      .mockResolvedValueOnce(Response.json({ url: 'https://statement.example.test/view' }))
      .mockResolvedValueOnce(Response.json(ok))
      .mockResolvedValueOnce(Response.json(ok))
    vi.stubGlobal('fetch', fetchMock)
    const service = createPopbillClient({ ...CONFIG, isTest: true }).services.statement
    const document = {
      documentTypeCode: 121 as const,
      managementKey: DOCUMENT_KEY.managementKey,
      writtenDate: '20261102',
      taxType: '과세' as const,
      sender: { businessNumber: BUSINESS_NUMBER, companyName: '발신자' },
      receiver: { businessNumber: '8888888888', companyName: '수신자' },
      paymentSummary: { totalSupplyCostAmount: '00020.50', totalTaxAmount: '0', totalAmount: '00020.50' },
      sendTextMessage: false,
      includeBusinessLicenseImage: false,
      propertyBag: { Balance: '0', CustomField: '유지' },
      lineItems: [{ lineNumber: 1, itemName: '상품', quantity: '0', supplyCostAmount: '00020.50', taxAmount: '0' }],
    }
    const before = structuredClone(document)

    await expect(service.registerStatement({ businessNumber: BUSINESS_NUMBER, document })).resolves.toEqual({
      resultCode: 1,
      resultMessage: 'mock success',
    })
    await expect(service.updateStatement({ ...DOCUMENT_KEY, document })).resolves.toEqual({ resultCode: 1, resultMessage: 'mock success' })
    await expect(service.issueStatement({ ...DOCUMENT_KEY, historyMemo: '발행 메모', emailSubject: '명세서 발행' })).resolves.toEqual({
      resultCode: 1,
      resultMessage: 'mock success',
    })
    await expect(service.getStatementInfo(DOCUMENT_KEY)).resolves.toMatchObject({
      itemKey: 'ITEM-001',
      stateCode: 300,
      totalSupplyCostAmount: '00020.50',
      totalTaxAmount: '0',
      isOpen: false,
    })
    await expect(
      service.searchStatements({
        businessNumber: BUSINESS_NUMBER,
        searchDateType: 'W',
        startDate: '20261101',
        endDate: '20261102',
        stateCodes: ['3**'],
        documentTypeCodes: [121, 126],
        queryText: '회사 & 상품/?',
      })
    ).resolves.toMatchObject({ totalCount: 1, statementSummaries: [{ itemKey: 'ITEM-001' }] })
    await expect(service.getStatementViewURL(DOCUMENT_KEY)).resolves.toEqual({ accessUrl: 'https://statement.example.test/view' })
    await expect(service.cancelIssuedStatement({ ...DOCUMENT_KEY, historyMemo: '취소 메모' })).resolves.toEqual({
      resultCode: 1,
      resultMessage: 'mock success',
    })
    await expect(service.deleteStatement(DOCUMENT_KEY)).resolves.toEqual({ resultCode: 1, resultMessage: 'mock success' })

    expect(document).toEqual(before)
    const requests = fetchMock.mock.calls.map(([input, init]) => ({ url: requestUrl(input), init: init!, headers: new Headers(init?.headers) }))
    expect(requests.map(({ url }) => url.pathname)).toEqual([
      '/POPBILL_TEST/Token',
      '/Statement',
      DOCUMENT_PATH,
      DOCUMENT_PATH,
      DOCUMENT_PATH,
      '/Statement/Search',
      DOCUMENT_PATH,
      DOCUMENT_PATH,
      DOCUMENT_PATH,
    ])
    expect(JSON.parse(requests[0]!.init.body as string)).toEqual({
      access_id: BUSINESS_NUMBER,
      scope: ['member', '121', '122', '123', '124', '125', '126'],
    })
    const rawDocument = {
      itemCode: 121,
      mgtKey: DOCUMENT_KEY.managementKey,
      writeDate: '20261102',
      taxType: '과세',
      senderCorpNum: BUSINESS_NUMBER,
      senderCorpName: '발신자',
      receiverCorpNum: '8888888888',
      receiverCorpName: '수신자',
      supplyCostTotal: '00020.50',
      taxTotal: '0',
      totalAmount: '00020.50',
      smssendYN: false,
      businessLicenseYN: false,
      propertyBag: { Balance: '0', CustomField: '유지' },
      detailList: [{ serialNum: 1, itemName: '상품', qty: '0', supplyCost: '00020.50', tax: '0' }],
    }
    expect(JSON.parse(requests[1]!.init.body as string)).toEqual(rawDocument)
    expect(JSON.parse(requests[2]!.init.body as string)).toEqual(rawDocument)
    expect(requests[2]!.headers.get('X-HTTP-Method-Override')).toBe('PATCH')
    expect(requests[3]!.headers.get('X-HTTP-Method-Override')).toBe('ISSUE')
    expect(JSON.parse(requests[3]!.init.body as string)).toEqual({ memo: '발행 메모', emailSubject: '명세서 발행' })
    expect(requests[5]!.url.searchParams.get('State')).toBe('3**')
    expect(requests[5]!.url.searchParams.get('ItemCode')).toBe('121,126')
    expect(requests[5]!.url.searchParams.get('QString')).toBe('회사 & 상품/?')
    expect(requests[6]!.url.searchParams.get('TG')).toBe('VIEW')
    expect(requests[7]!.headers.get('X-HTTP-Method-Override')).toBe('CANCEL')
    expect(JSON.parse(requests[7]!.init.body as string)).toEqual({ memo: '취소 메모' })
    expect(requests[8]!.headers.get('X-HTTP-Method-Override')).toBe('DELETE')
  })

  test('isolates statement and tax invoice scopes and tokens across test and production clients', async () => {
    let tokenNumber = 0
    const fetchMock = vi.fn<typeof fetch>((input) => {
      const url = requestUrl(input)
      if (url.pathname.endsWith('/Token')) {
        tokenNumber += 1
        return Promise.resolve(
          Response.json({ session_token: `token-${tokenNumber}`, expiration: '2099-01-01T00:00:00Z', serviceID: url.pathname.split('/')[1] })
        )
      }
      return Promise.resolve(Response.json({ itemKey: 'ITEM-001', itemCode: 121, stateCode: 100 }))
    })
    vi.stubGlobal('fetch', fetchMock)
    const testClient = createPopbillClient({ ...CONFIG, isTest: true })
    const productionClient = createPopbillClient({ ...CONFIG, isTest: false, userId: 'production-user' })

    await testClient.services.statement.getStatementInfo(DOCUMENT_KEY)
    await productionClient.services.statement.getStatementInfo(DOCUMENT_KEY)
    await testClient.services.taxInvoice.getInvoiceInfo({
      businessNumber: BUSINESS_NUMBER,
      invoiceDocumentKeyType: 'SELL',
      invoiceManagementKey: 'INV-001',
    })
    await testClient.services.statement.getStatementInfo(DOCUMENT_KEY)

    const requests = fetchMock.mock.calls.map(([input, init]) => ({ url: requestUrl(input), init: init!, headers: new Headers(init?.headers) }))
    const tokens = requests.filter(({ url }) => url.pathname.endsWith('/Token'))
    expect(tokens.map(({ url }) => url.pathname)).toEqual(['/POPBILL_TEST/Token', '/POPBILL/Token', '/POPBILL_TEST/Token'])
    expect(tokens.map(({ init }) => JSON.parse(init.body as string).scope)).toEqual([
      ['member', '121', '122', '123', '124', '125', '126'],
      ['member', '121', '122', '123', '124', '125', '126'],
      ['member', '110'],
    ])
    const apiRequests = requests.filter(({ url }) => !url.pathname.endsWith('/Token'))
    expect(apiRequests.map(({ url }) => url.hostname)).toEqual([
      'popbill-test.linkhub.co.kr',
      'popbill.linkhub.co.kr',
      'popbill-test.linkhub.co.kr',
      'popbill-test.linkhub.co.kr',
    ])
    expect(apiRequests.map(({ headers }) => headers.get('Authorization'))).toEqual([
      'Bearer token-1',
      'Bearer token-2',
      'Bearer token-3',
      'Bearer token-1',
    ])
  })

  test('normalizes a failed issue once without replaying the chargeable request', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ session_token: 'statement-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
      .mockResolvedValueOnce(Response.json({ code: -12001, message: '발행 실패' }, { status: 400 }))
    vi.stubGlobal('fetch', fetchMock)
    const onError = vi.fn<(error: unknown) => void>()
    const service = createPopbillClient({ ...CONFIG, isTest: true, onError }).services.statement

    await expect(service.issueStatement(DOCUMENT_KEY)).rejects.toMatchObject({
      code: -12001,
      message: '발행 실패',
      operation: 'statement.issueStatement',
    })
    expect(onError).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ code: -12001, operation: 'statement.issueStatement' }))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
