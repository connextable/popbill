import { mapTaxInvoiceInfo } from '@/services/tax-invoice/mappers/invoice-info'
import type * as Spec from '@connextable/popbill-spec'
import type { TaxInvoiceInfo } from '@/services/tax-invoice/types'

const BASE_RESPONSE: Spec.TaxInvoiceGetInfoApiResponse = {
  itemKey: 'ITEM-1',
  taxType: '과세',
  writeDate: '20260225',
  regDT: '20260225120000',
  issueType: '정발행',
  supplyCostTotal: '10000',
  taxTotal: '1000',
  purposeType: '영수',
  issueDT: '20260225120000',
  lateIssueYN: 'false',
  openYN: 'false',
  stateMemo: '발행 완료',
  stateCode: 300,
  stateDT: '20260225120001',
  interOPYN: 'true',
  invoicerCorpName: '공급자',
  invoicerCorpNum: '1234567890',
  invoicerPrintYN: 'false',
  invoiceeCorpName: '공급받는자',
  invoiceeCorpNum: '8888888888',
  invoiceePrintYN: 'true',
}

describe('tax-invoice invoice-info mapper', () => {
  test('allows an unissued invoice summary without issue time or state memo', () => {
    const { issueDT: _issueDT, stateMemo: _stateMemo, ...draft } = BASE_RESPONSE
    const result = mapTaxInvoiceInfo({ ...draft, stateCode: 100 })

    expect(result.issuedAt).toBeUndefined()
    expect(result.stateMemo).toBeUndefined()
    expectTypeOf<TaxInvoiceInfo['issuedAt']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<TaxInvoiceInfo['stateMemo']>().toEqualTypeOf<string | undefined>()
  })

  test('keeps numeric stateCode and trustee print flag undefined when source is missing', () => {
    const result = mapTaxInvoiceInfo({
      ...BASE_RESPONSE,
      stateCode: 300,
      trusteePrintYN: undefined,
    })

    expect(result.stateCode).toBe(300)
    expect(result.isTrusteePrinted).toBeUndefined()
  })

  test('converts string stateCode and trustee print flag to normalized values', () => {
    const result = mapTaxInvoiceInfo({
      ...BASE_RESPONSE,
      stateCode: '301',
      trusteePrintYN: 'true',
    } as unknown as Spec.TaxInvoiceGetInfoApiResponse)

    expect(result.stateCode).toBe(301)
    expect(result.isTrusteePrinted).toBe(true)
  })

  test.each(['future-state', '', '   ', null, undefined, '9007199254740993'])(
    'preserves provider state without rejecting the summary: %j',
    (stateCode) => {
      expect(
        mapTaxInvoiceInfo({
          ...BASE_RESPONSE,
          stateCode,
        } as unknown as Spec.TaxInvoiceGetInfoApiResponse).stateCode
      ).toBe(stateCode)
    }
  )

  test.each([0, '0'])('preserves zero stateCode: %j', (stateCode) => {
    expect(mapTaxInvoiceInfo({ ...BASE_RESPONSE, stateCode }).stateCode).toBe(0)
  })

  test('preserves unavailable and future flags while normalizing recognized boolean forms', () => {
    const result = mapTaxInvoiceInfo({
      ...BASE_RESPONSE,
      lateIssueYN: null,
      openYN: 'future-flag',
      interOPYN: ' Y ',
      invoicerPrintYN: '0',
      invoiceePrintYN: 1,
      trusteePrintYN: null,
    } as unknown as Spec.TaxInvoiceGetInfoApiResponse)

    expect(result).toMatchObject({
      isLateIssued: null,
      isOpen: 'future-flag',
      isApiLinkedDocument: true,
      isSupplierPrinted: false,
      isBuyerPrinted: true,
      isTrusteePrinted: null,
    })
  })
})
