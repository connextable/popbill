import * as helpers from './helpers'

describe('taxinvoice runtime: remaining contracts', () => {
  beforeEach(() => helpers.configureCompat())
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('charge information preserves decimal strings and unit cost has no user ID', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ unitCost: '10.5000', chargeMethod: '연동', rateSystem: '종량제' }),
      helpers.toJsonResponse({ unitCost: '10.5000' })
    )
    const service = helpers.promiseCompat.TaxinvoiceService()
    await expect(service.getChargeInfo('1234567890', 'billing-user')).resolves.toEqual({
      unitCost: '10.5000',
      chargeMethod: '연동',
      rateSystem: '종량제',
    })
    await expect(service.getUnitCost('1234567890')).resolves.toBe('10.5000')
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain('/Taxinvoice/ChargeInfo')
    expect(String(fetchMock.mock.calls[2]?.[0])).toContain('/Taxinvoice?cfg=UNITCOST')
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get('x-pb-userid')).toBe('billing-user')
    expect(new Headers(fetchMock.mock.calls[2]?.[1]?.headers).get('x-pb-userid')).toBeNull()
  })

  test.each([
    ['cancelSend', 'CANCELSEND'],
    ['accept', 'ACCEPT'],
    ['deny', 'DENY'],
  ] as const)('%s sends the legacy method override and memo', async (name, override) => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'OK' })
    )
    await expect(helpers.promiseCompat.TaxinvoiceService()[name]('1234567890', 'SELL', 'KEY-1', '이력', 'user')).resolves.toEqual({
      code: 1,
      message: 'OK',
    })
    helpers.expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL/KEY-1')
    const init = helpers.getTaxinvoiceRequestInit(fetchMock)
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>)['X-HTTP-Method-Override']).toBe(override)
    expect(JSON.parse(init.body as string)).toEqual({ memo: '이력' })
  })

  test('send promise distinguishes short UserID from full EmailSubject/UserID slots', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'OK' }),
      helpers.toJsonResponse({ code: 1, message: 'OK' })
    )
    const service = helpers.promiseCompat.TaxinvoiceService()
    await service.send('1234567890', 'BUY', 'KEY-1', 'memo', 'short-user')
    await service.send('1234567890', 'BUY', 'KEY-1', 'memo', '제목', 'full-user')
    const short = fetchMock.mock.calls[1]?.[1] as RequestInit
    const full = fetchMock.mock.calls[2]?.[1] as RequestInit
    expect(JSON.parse(short.body as string)).toEqual({ memo: 'memo' })
    expect((short.headers as Record<string, string>)['x-pb-userid']).toBe('short-user')
    expect(JSON.parse(full.body as string)).toEqual({ memo: 'memo', emailSubject: '제목' })
    expect((full.headers as Record<string, string>)['x-pb-userid']).toBe('full-user')
    expect((full.headers as Record<string, string>)['X-HTTP-Method-Override']).toBe('SEND')
  })

  test.each(['short', 'user', 'full', 'default-user'] as const)('send callback %s overload delivers success', async (shape) => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'OK' })
    )
    const result = await new Promise<unknown>((resolve, reject) => {
      const service = helpers.compat.TaxinvoiceService()
      if (shape === 'short') service.send('1234567890', 'SELL', 'KEY', 'memo', resolve, reject)
      else if (shape === 'user') service.send('1234567890', 'SELL', 'KEY', 'memo', 'user', resolve, reject)
      else if (shape === 'default-user') service.send('1234567890', 'SELL', 'KEY', 'memo', '제목', undefined, resolve, reject)
      else service.send('1234567890', 'SELL', 'KEY', 'memo', '제목', 'user', resolve, reject)
    })
    expect(result).toEqual({ code: 1, message: 'OK' })
    const init = helpers.getTaxinvoiceRequestInit(fetchMock)
    expect(JSON.parse(init.body as string)).toEqual(
      shape === 'full' || shape === 'default-user' ? { memo: 'memo', emailSubject: '제목' } : { memo: 'memo' }
    )
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe(shape === 'short' || shape === 'default-user' ? undefined : 'user')
  })

  test('legacy old print URL and undocumented email key response are preserved', async () => {
    const keys = [{ email: 'test@example.com', publicKey: 'key', future: true }]
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ url: 'https://example.com/old' }),
      helpers.toJsonResponse(keys)
    )
    const service = helpers.promiseCompat.TaxinvoiceService()
    await expect(service.getOldPrintURL('1234567890', 'TRUSTEE', 'KEY')).resolves.toBe('https://example.com/old')
    await expect(service.getEmailPublicKeys('1234567890')).resolves.toEqual(keys)
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain('?TG=PRINTOLD')
    expect(String(fetchMock.mock.calls[2]?.[0])).toContain('/Taxinvoice/EmailPublicKeys')
  })

  test.each([
    {
      name: 'getChargeInfo',
      args: ['1234567890'],
      raw: { unitCost: '10.50', chargeMethod: '연동', rateSystem: '종량제' },
      result: { unitCost: '10.50', chargeMethod: '연동', rateSystem: '종량제' },
    },
    { name: 'getUnitCost', args: ['1234567890'], raw: { unitCost: '10.50' }, result: '10.50' },
    { name: 'cancelSend', args: ['1234567890', 'SELL', 'KEY', 'memo'], raw: { code: 1, message: 'OK' }, result: { code: 1, message: 'OK' } },
    { name: 'accept', args: ['1234567890', 'SELL', 'KEY', 'memo'], raw: { code: 1, message: 'OK' }, result: { code: 1, message: 'OK' } },
    { name: 'deny', args: ['1234567890', 'SELL', 'KEY', 'memo'], raw: { code: 1, message: 'OK' }, result: { code: 1, message: 'OK' } },
    { name: 'getOldPrintURL', args: ['1234567890', 'SELL', 'KEY'], raw: { url: 'https://example.com/old' }, result: 'https://example.com/old' },
    { name: 'getEmailPublicKeys', args: ['1234567890'], raw: ['opaque-key'], result: ['opaque-key'] },
  ])('$name supports the legacy callback boundary', async ({ name, args, raw, result }) => {
    helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(raw))
    const service = helpers.compat.TaxinvoiceService() as unknown as Record<string, (...a: unknown[]) => void>
    await expect(new Promise<unknown>((resolve, reject) => service[name]!(...args, resolve, reject))).resolves.toEqual(result)
  })

  test('PDF is returned as a Buffer without decoding or losing arbitrary bytes', async () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x00, 0xff, 0xfe, 0x80])
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } })
    )
    const result = await helpers.promiseCompat.TaxinvoiceService().getPDF('1234567890', 'SELL', 'PDF-1', 'pdf-user')
    expect(Buffer.isBuffer(result)).toBe(true)
    expect([...result]).toEqual([...bytes])
    helpers.expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL/PDF-1?PDF')
    expect((helpers.getTaxinvoiceRequestInit(fetchMock).headers as Record<string, string>)['x-pb-userid']).toBe('pdf-user')
  })

  test('PDF JSON API errors reject through the normal error contract', async () => {
    helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -11000001, message: '문서가 없습니다.' }, 400)
    )
    await expect(helpers.promiseCompat.TaxinvoiceService().getPDF('1234567890', 'SELL', 'MISSING')).rejects.toMatchObject({
      code: -11000001,
      message: '문서가 없습니다.',
    })
  })

  test('PDF callback returns bytes and validation errors use the error callback', async () => {
    helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      new Response(new Uint8Array([0, 255]), { headers: { 'Content-Type': 'application/pdf' } })
    )
    const result = await new Promise<Buffer>((resolve, reject) =>
      helpers.compat.TaxinvoiceService().getPDF('1234567890', 'SELL', 'PDF-1', resolve, reject)
    )
    expect([...result]).toEqual([0, 255])
    const error = await new Promise<unknown>((resolve) =>
      helpers.compat.TaxinvoiceService().getPDF(
        '',
        'SELL',
        'PDF-1',
        () => {
          throw new Error('Unexpected success')
        },
        resolve
      )
    )
    expect(error).toMatchObject({ code: -99999999 })
  })

  test.each(['1', '2'] as const)('PDF promise forwards print copy %s after the existing user ID slot', async (pdfInvoiceType) => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      new Response(new Uint8Array([0, 255]), { headers: { 'Content-Type': 'application/pdf' } })
    )
    const result = await helpers.promiseCompat.TaxinvoiceService().getPDF('1234567890', 'SELL', 'PDF-1', 'pdf-user', pdfInvoiceType)
    expect([...result]).toEqual([0, 255])
    helpers.expectTaxinvoiceRequestPath(fetchMock, `/Taxinvoice/SELL/PDF-1?PDF&PdfInvoiceType=${pdfInvoiceType}`)
    expect((helpers.getTaxinvoiceRequestInit(fetchMock).headers as Record<string, string>)['x-pb-userid']).toBe('pdf-user')
  })

  test.each(['pdf-user', undefined])('PDF callbacks accept the new copy option with user ID %s', async (userId) => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      new Response(new Uint8Array([0, 255]), { headers: { 'Content-Type': 'application/pdf' } })
    )
    const result = await new Promise<Buffer>((resolve, reject) =>
      helpers.compat.TaxinvoiceService().getPDF('1234567890', 'SELL', 'PDF-1', userId, '2', resolve, reject)
    )
    expect([...result]).toEqual([0, 255])
    helpers.expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL/PDF-1?PDF&PdfInvoiceType=2')
    expect((helpers.getTaxinvoiceRequestInit(fetchMock).headers as Record<string, string>)['x-pb-userid']).toBe(userId)
  })

  test('PDF callbacks preserve omitted copy behavior with explicit undefined', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      new Response(new Uint8Array([0, 255]), { headers: { 'Content-Type': 'application/pdf' } })
    )
    await new Promise<Buffer>((resolve, reject) =>
      helpers.compat.TaxinvoiceService().getPDF('1234567890', 'SELL', 'PDF-1', 'pdf-user', undefined, resolve, reject)
    )
    expect(String(fetchMock.mock.calls[1]?.[0])).toBe('https://popbill-test.linkhub.co.kr/Taxinvoice/SELL/PDF-1?PDF')
  })

  test('invalid PDF copy rejects before token issuance', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    await expect(helpers.promiseCompat.TaxinvoiceService().getPDF('1234567890', 'SELL', 'PDF-1', 'pdf-user', '3' as '1')).rejects.toMatchObject({
      code: -99999999,
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
