import { mapTaxInvoiceInfo } from '@/services/tax-invoice/mappers/invoice-info'
import type * as Spec from '@connextable/popbill-spec'

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

  test('throws when stateCode is not numeric', () => {
    expect(() =>
      mapTaxInvoiceInfo({
        ...BASE_RESPONSE,
        stateCode: 'invalid',
      } as unknown as Spec.TaxInvoiceGetInfoApiResponse)
    ).toThrow('유효하지 않은 stateCode 응답값입니다.')
  })
})
