import {
  mapTaxInvoiceBulkIssueSubmissionResult,
  mapTaxInvoiceDocumentOutput,
  mapTaxInvoiceIssueResult,
  mapTaxInvoiceLogs,
  mapTaxInvoiceOperationResult,
  mapTaxInvoiceSearchResult,
  mapTaxInvoiceTaxCertificateInfo,
} from '@/services/tax-invoice/mappers/response'
import type * as Spec from '@connextable/popbill-spec'

describe('tax-invoice response mapper', () => {
  test('maps certificate policy identifiers from current and legacy response keys', () => {
    expect(mapTaxInvoiceTaxCertificateInfo({ oid: '1.2.410.200012.1.1.3' }).policyObjectIdentifier).toBe('1.2.410.200012.1.1.3')
    expect(mapTaxInvoiceTaxCertificateInfo({ OID: 'legacy-policy' }).policyObjectIdentifier).toBe('legacy-policy')
  })

  test('omits unavailable issue times while preserving a returned timestamp', () => {
    expect(mapTaxInvoiceIssueResult({ code: 1, message: 'issued', issueDT: null })).toEqual({ resultCode: 1, resultMessage: 'issued' })
    expect(mapTaxInvoiceIssueResult({ code: 1, message: 'issued', issueDT: '20261102120000' }).issuedAt).toBe('20261102120000')
  })

  test('converts numeric string code to number', () => {
    const result = mapTaxInvoiceOperationResult({
      code: '1',
      message: 'OK',
    })

    expect(result).toEqual({
      resultCode: 1,
      resultMessage: 'OK',
    })
  })

  test.each(['future-code', '', '   ', null, undefined, '9007199254740993'])('preserves provider operation codes: %j', (code) => {
    expect(mapTaxInvoiceOperationResult({ code, message: 'OK' }).resultCode).toBe(code)
  })

  test.each([0, '0'])('preserves zero result code: %j', (code) => {
    expect(mapTaxInvoiceOperationResult({ code, message: 'OK' }).resultCode).toBe(0)
  })

  test.each(['', '   ', null, false, Number.NaN, Number.POSITIVE_INFINITY])('omits invalid optional numbers: %j', (value) => {
    const result = mapTaxInvoiceSearchResult({
      code: 1,
      message: 'OK',
      total: value,
      perPage: value,
      pageNum: value,
      pageCount: value,
    } as Spec.TaxInvoiceSearchApiResponse)

    expect(result).toEqual({
      operationResult: { resultCode: 1, resultMessage: 'OK' },
      invoiceSummaries: [],
    })
  })

  test.each([0, '0'])('preserves optional zero numbers: %j', (value) => {
    const result = mapTaxInvoiceSearchResult({ code: 1, message: 'OK', total: value })

    expect(result.totalCount).toBe(0)
  })

  test('preserves empty and future document and log codes', () => {
    expect(mapTaxInvoiceDocumentOutput({ stateCode: '' }).stateCode).toBe('')
    expect(mapTaxInvoiceLogs([{ docLogType: '   ' }, { docLogType: 'future-log' }])).toEqual([
      { documentLogTypeCode: '   ' },
      { documentLogTypeCode: 'future-log' },
    ])
  })

  test('preserves numeric and legacy string book numbers in document output', () => {
    expect(mapTaxInvoiceDocumentOutput({ kwon: 0, ho: 123 })).toMatchObject({ bookVolumeNumber: 0, bookIssueNumber: 123 })
    expect(mapTaxInvoiceDocumentOutput({ kwon: '0001', ho: '0002' })).toMatchObject({ bookVolumeNumber: '0001', bookIssueNumber: '0002' })
  })

  test('maps bulk receipt time at submission and item levels independently', () => {
    const result = mapTaxInvoiceBulkIssueSubmissionResult({
      code: 1,
      message: 'OK',
      receiptDT: '20260515120000',
      issueResult: [{ receiptDT: '20260515120001' }],
    })

    expect(result).toEqual({
      resultCode: 1,
      resultMessage: 'OK',
      receivedAt: '20260515120000',
      issueResults: [{ receivedAt: '20260515120001' }],
    })
  })

  test.each([0, '0', 1, '1', 2, '2', 99, '99'])('preserves known and newly added bulk transaction states: %j', (txState) => {
    const result = mapTaxInvoiceBulkIssueSubmissionResult({ code: 1, message: 'OK', txState })

    expect(result.transactionState).toBe(Number(txState))
  })

  test.each([-1, 0.5, '', '   ', null, 'future-state', '9007199254740993'])('preserves unrecognized bulk transaction states: %j', (txState) => {
    const result = mapTaxInvoiceBulkIssueSubmissionResult({ code: 1, message: 'OK', txState } as Spec.TaxInvoiceGetBulkResultApiResponse)

    expect(result.transactionState).toBe(txState)
  })

  test('omits empty bulk counts while retaining zero counts and original result codes', () => {
    const result = mapTaxInvoiceBulkIssueSubmissionResult({
      code: 1,
      message: 'OK',
      submitCount: '0',
      successCount: '',
      failCount: '   ',
      txResultCode: '',
      issueResult: [{ code: '' }],
    })

    expect(result).toEqual({
      resultCode: 1,
      resultMessage: 'OK',
      submittedDocumentCount: 0,
      transactionResultCode: '',
      issueResults: [{ resultCode: '' }],
    })
  })

  test('keeps future charge directions and nullable document flags without changing amounts', () => {
    expect(
      mapTaxInvoiceDocumentOutput({
        chargeDirection: 'future-direction',
        stateCode: 'future-state',
        supplyCostTotal: '00020.5000',
        lateIssueYN: null,
        openYN: 'future-flag',
        businessLicenseYN: ' Y ',
        bankBookYN: 'N',
        invoicerSMSSendYN: null,
        invoiceePrintYN: 'future-print-flag',
      } as unknown as Spec.TaxInvoiceGetDetailInfoApiResponse)
    ).toMatchObject({
      chargeDirection: 'future-direction',
      stateCode: 'future-state',
      paymentSummary: { totalSupplyCostAmount: '00020.5000' },
      isLateIssued: null,
      isOpen: 'future-flag',
      includeBusinessLicenseImage: true,
      includeBankBookImage: false,
      supplier: { sendTextMessage: null },
      buyer: { printEnabled: 'future-print-flag' },
    })
    expect(mapTaxInvoiceDocumentOutput({ chargeDirection: null } as unknown as Spec.TaxInvoiceGetDetailInfoApiResponse).chargeDirection).toBeNull()
  })
})
