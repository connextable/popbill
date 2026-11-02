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

  test.each(['invalid', '', '   ', null, false, Number.NaN, Number.POSITIVE_INFINITY])('throws when operation result code is invalid: %j', (code) => {
    expect(() =>
      mapTaxInvoiceOperationResult({
        code,
        message: 'BAD',
      } as Spec.TaxInvoiceApiResponseBase)
    ).toThrow('유효하지 않은 code 응답값입니다.')
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

  test('omits empty document and log numeric codes', () => {
    expect(mapTaxInvoiceDocumentOutput({ stateCode: '' })).not.toHaveProperty('stateCode')
    expect(mapTaxInvoiceLogs([{ docLogType: '   ' }])).toEqual([{}])
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

  test.each([-1, 0.5, '', '   ', null, false])('omits malformed bulk transaction state: %j', (txState) => {
    const result = mapTaxInvoiceBulkIssueSubmissionResult({ code: 1, message: 'OK', txState } as Spec.TaxInvoiceGetBulkResultApiResponse)

    expect(result).not.toHaveProperty('transactionState')
  })

  test('omits empty bulk counts and result codes while retaining zero counts', () => {
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
      issueResults: [{}],
    })
  })
})
