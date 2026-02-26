import { PopbillErrorStage, PopbillErrorType, createPopbillClient } from '@/index'
import type { TaxInvoiceInfo } from '@/services/tax-invoice/types'

describe('tax-invoice getInvoiceInfo', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('requests token then calls getInvoiceInfo endpoint', async () => {
    const tokenResponse = {
      session_token: 'session-token',
      expiration: '2099-01-01T00:00:00Z',
      serviceID: 'POPBILL_TEST',
    }

    const invoiceInfoApiResponse = {
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

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(tokenResponse), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(invoiceInfoApiResponse), { status: 200 }))

    vi.stubGlobal('fetch', fetchMock)

    const client = createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      isTest: true,
      useLocalTime: true,
    })

    const response = await client.services.taxInvoice.getInvoiceInfo({
      businessNumber: '1234567890',
      invoiceDocumentKeyType: 'SELL',
      invoiceManagementKey: '20260224-001',
    })

    const expectedResponse: TaxInvoiceInfo = {
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
    }

    expect(response).toMatchObject(expectedResponse)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('https://auth.linkhub.co.kr/POPBILL_TEST/Token')
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain(
      'https://popbill-test.linkhub.co.kr/Taxinvoice/SELL/20260224-001'
    )

    const secondRequestInit = fetchMock.mock.calls[1]?.[1] as RequestInit
    const secondRequestHeaders = secondRequestInit.headers as Record<string, string>
    expect(secondRequestHeaders['Authorization']).toBe('Bearer session-token')
    expect(secondRequestHeaders['Accept-Encoding']).toBe('gzip')
    expect(secondRequestHeaders).not.toHaveProperty('Accept-Language')
  })

  test('includes Accept-Language header when configured', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            session_token: 'session-token',
            expiration: '2099-01-01T00:00:00Z',
            serviceID: 'POPBILL_TEST',
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            itemKey: '123',
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
          }),
          { status: 200 }
        )
      )

    vi.stubGlobal('fetch', fetchMock)

    const client = createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      isTest: true,
      acceptLanguage: 'en-US',
    })

    await client.services.taxInvoice.getInvoiceInfo({
      businessNumber: '1234567890',
      invoiceDocumentKeyType: 'SELL',
      invoiceManagementKey: '20260224-001',
    })

    const secondRequestInit = fetchMock.mock.calls[1]?.[1] as RequestInit
    const secondRequestHeaders = secondRequestInit.headers as Record<string, string>
    expect(secondRequestHeaders['Accept-Language']).toBe('en-US')
  })

  test('uses production popbill domain when isTest is omitted', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            session_token: 'session-token',
            expiration: '2099-01-01T00:00:00Z',
            serviceID: 'POPBILL',
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            itemKey: '123',
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
          }),
          { status: 200 }
        )
      )

    vi.stubGlobal('fetch', fetchMock)

    const client = createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
    })

    await client.services.taxInvoice.getInvoiceInfo({
      businessNumber: '1234567890',
      invoiceDocumentKeyType: 'SELL',
      invoiceManagementKey: '20260224-001',
    })

    expect(String(fetchMock.mock.calls[1]?.[0])).toContain('https://popbill.linkhub.co.kr/Taxinvoice/SELL/20260224-001')
  })

  test('uses custom Accept-Encoding header when configured', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            session_token: 'session-token',
            expiration: '2099-01-01T00:00:00Z',
            serviceID: 'POPBILL_TEST',
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            itemKey: '123',
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
          }),
          { status: 200 }
        )
      )

    vi.stubGlobal('fetch', fetchMock)

    const client = createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      isTest: true,
      acceptEncoding: 'br',
    })

    await client.services.taxInvoice.getInvoiceInfo({
      businessNumber: '1234567890',
      invoiceDocumentKeyType: 'SELL',
      invoiceManagementKey: '20260224-001',
    })

    const secondRequestInit = fetchMock.mock.calls[1]?.[1] as RequestInit
    const secondRequestHeaders = secondRequestInit.headers as Record<string, string>
    expect(secondRequestHeaders['Accept-Encoding']).toBe('br')
  })

  test('throws on invalid input before requesting network', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const onError = vi.fn()

    const client = createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      isTest: true,
      onError,
    })

    await expect(
      client.services.taxInvoice.getInvoiceInfo({
        businessNumber: '',
        invoiceDocumentKeyType: 'SELL',
        invoiceManagementKey: 'MGT-1',
      })
    ).rejects.toMatchObject({
      code: -99999999,
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
      operation: 'taxInvoice.getInvoiceInfo',
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: -99999999,
        type: PopbillErrorType.InputValidation,
        stage: PopbillErrorStage.ValidateInput,
        operation: 'taxInvoice.getInvoiceInfo',
      })
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('normalizes issue-token failure and invokes onError', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          code: -11000000,
          message: 'Authentication denied',
        }),
        { status: 401 }
      )
    )

    vi.stubGlobal('fetch', fetchMock)
    const onError = vi.fn()

    const client = createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      isTest: true,
      onError,
    })

    await expect(
      client.services.taxInvoice.getInvoiceInfo({
        businessNumber: '1234567890',
        invoiceDocumentKeyType: 'SELL',
        invoiceManagementKey: 'MGT-1',
      })
    ).rejects.toMatchObject({
      code: -11000000,
      message: 'Authentication denied',
      type: PopbillErrorType.ApiResponse,
      stage: PopbillErrorStage.IssueToken,
      operation: 'taxInvoice.getInvoiceInfo',
      status: 401,
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: -11000000,
        type: PopbillErrorType.ApiResponse,
        stage: PopbillErrorStage.IssueToken,
        operation: 'taxInvoice.getInvoiceInfo',
      })
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
