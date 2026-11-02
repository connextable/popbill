import { createTaxInvoiceService } from '@/services/tax-invoice'

type CompatService = Parameters<typeof createTaxInvoiceService>[0]['compatTaxInvoiceService']

describe('tax invoice billing and PDF facade', () => {
  test('billing keeps the provider decimal precision and applies the configured user only where supported', async () => {
    const getChargeInfo = vi
      .fn<CompatService['getChargeInfo']>()
      .mockResolvedValue({ unitCost: '20.0010', chargeMethod: '연동', rateSystem: '종량제' })
    const getUnitCost = vi.fn<CompatService['getUnitCost']>().mockResolvedValue('20.0010')
    const service = createTaxInvoiceService({
      compatTaxInvoiceService: { getChargeInfo, getUnitCost } as unknown as CompatService,
      defaultUserId: 'user',
    })
    await expect(service.getChargeInfo({ businessNumber: '1234567890' })).resolves.toEqual({
      unitCost: '20.0010',
      chargeMethod: '연동',
      rateSystem: '종량제',
    })
    await expect(service.getUnitCost({ businessNumber: '1234567890' })).resolves.toEqual({ unitCost: '20.0010' })
    expect(getChargeInfo).toHaveBeenCalledWith('1234567890', 'user')
    expect(getUnitCost).toHaveBeenCalledWith('1234567890')
  })

  test('PDF forwards the document identity and returns independent raw bytes', async () => {
    const source = Buffer.from([0x25, 0x50, 0x44, 0x46, 0, 255])
    const getPDF = vi.fn<CompatService['getPDF']>().mockResolvedValue(source)
    const service = createTaxInvoiceService({ compatTaxInvoiceService: { getPDF } as unknown as CompatService, defaultUserId: 'user' })
    const result = await service.downloadInvoicePDF({ businessNumber: '1234567890', invoiceDocumentKeyType: 'SELL', invoiceManagementKey: 'KEY-1' })
    expect(getPDF).toHaveBeenCalledWith('1234567890', 'SELL', 'KEY-1', 'user', undefined)
    expect(result.fileData).toBeInstanceOf(Uint8Array)
    expect([...result.fileData]).toEqual([...source])
    source[0] = 0
    expect(result.fileData[0]).toBe(0x25)
    expect(service).not.toHaveProperty('getPDF')
    expect(service).not.toHaveProperty('send')
  })

  test('binary API errors use the facade operation and notify once', async () => {
    const onError = vi.fn<(error: unknown) => void>()
    const getPDF = vi.fn<CompatService['getPDF']>().mockRejectedValue({ code: -11000001, message: '문서가 없습니다.' })
    const service = createTaxInvoiceService({ compatTaxInvoiceService: { getPDF } as unknown as CompatService, defaultUserId: 'user', onError })
    await expect(
      service.downloadInvoicePDF({ businessNumber: '1234567890', invoiceDocumentKeyType: 'SELL', invoiceManagementKey: 'KEY-1' })
    ).rejects.toMatchObject({ operation: 'taxInvoice.downloadInvoicePDF', code: -11000001 })
    expect(onError).toHaveBeenCalledTimes(1)
  })

  test.each([
    ['supplier', '1'],
    ['buyer', '2'],
  ] as const)('maps the %s print copy to provider option %s', async (printCopy, pdfInvoiceType) => {
    const getPDF = vi.fn<CompatService['getPDF']>().mockResolvedValue(Buffer.from([37, 80, 68, 70]))
    const service = createTaxInvoiceService({ compatTaxInvoiceService: { getPDF } as unknown as CompatService, defaultUserId: 'user' })
    await service.downloadInvoicePDF({ businessNumber: '1234567890', invoiceDocumentKeyType: 'SELL', invoiceManagementKey: 'KEY-1', printCopy })
    expect(getPDF).toHaveBeenCalledWith('1234567890', 'SELL', 'KEY-1', 'user', pdfInvoiceType)
  })

  test('rejects an invalid print copy before calling compat', async () => {
    const getPDF = vi.fn<CompatService['getPDF']>()
    const onError = vi.fn<(error: unknown) => void>()
    const service = createTaxInvoiceService({ compatTaxInvoiceService: { getPDF } as unknown as CompatService, defaultUserId: 'user', onError })
    await expect(
      service.downloadInvoicePDF({
        businessNumber: '1234567890',
        invoiceDocumentKeyType: 'SELL',
        invoiceManagementKey: 'KEY-1',
        printCopy: 'invalid' as 'buyer',
      })
    ).rejects.toMatchObject({ operation: 'taxInvoice.downloadInvoicePDF', stage: 'validate_input' })
    expect(getPDF).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
  })

  test.each(['SELL', 'BUY', 'TRUSTEE'] as const)('PDF forwards the SDK-supported %s document type', async (invoiceDocumentKeyType) => {
    const getPDF = vi.fn<CompatService['getPDF']>().mockResolvedValue(Buffer.from([37, 80, 68, 70]))
    const service = createTaxInvoiceService({ compatTaxInvoiceService: { getPDF } as unknown as CompatService, defaultUserId: 'user' })
    await expect(
      service.downloadInvoicePDF({ businessNumber: '1234567890', invoiceDocumentKeyType, invoiceManagementKey: 'KEY-1' })
    ).resolves.toMatchObject({ fileData: new Uint8Array([37, 80, 68, 70]) })
    expect(getPDF).toHaveBeenCalledWith('1234567890', invoiceDocumentKeyType, 'KEY-1', 'user', undefined)
  })
})
