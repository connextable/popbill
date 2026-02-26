import { mapTaxInvoiceOperationResult } from '@/services/tax-invoice/mappers/response'

describe('tax-invoice response mapper', () => {
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

  test('throws when operation result code is invalid', () => {
    expect(() =>
      mapTaxInvoiceOperationResult({
        code: 'invalid',
        message: 'BAD',
      })
    ).toThrow('유효하지 않은 code 응답값입니다.')
  })
})
