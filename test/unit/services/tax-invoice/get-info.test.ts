import { createPopbillClient, type TaxInvoiceInfo } from '@/index'

describe('tax-invoice getInfo', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('requests token then calls getInfo endpoint', async () => {
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

    const response = await client.services.taxInvoice.getInfo({
      businessNumber: '1234567890',
      invoiceKeyType: 'SELL',
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
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain('https://popbill-test.linkhub.co.kr/Taxinvoice/SELL/20260224-001')
  })

  test('throws on invalid input before requesting network', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const client = createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      isTest: true,
    })

    await expect(
      client.services.taxInvoice.getInfo({
        businessNumber: '',
        invoiceKeyType: 'SELL',
        invoiceManagementKey: 'MGT-1',
      }),
    ).rejects.toMatchObject({
      code: -99999999,
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
