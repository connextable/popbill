import { mapTaxInvoiceDocument, mapTaxInvoiceDocuments } from '@/services/tax-invoice/mappers/document'
import {
  TaxInvoiceChargeDirectionValues,
  TaxInvoiceIssueTypes,
  TaxInvoicePurposeTypes,
  TaxInvoiceRecipientTypes,
  TaxInvoiceTaxationTypes,
  type TaxInvoiceDocumentInput,
} from '@/services/tax-invoice/types'

const TAX_INVOICE_DOCUMENT: TaxInvoiceDocumentInput = {
  writtenDate: '20260226',
  chargeDirection: TaxInvoiceChargeDirectionValues.NormalCharge,
  issueType: TaxInvoiceIssueTypes.Normal,
  purposeType: TaxInvoicePurposeTypes.Receipt,
  taxType: TaxInvoiceTaxationTypes.Taxable,
  supplier: {
    businessNumber: '1234567890',
    companyName: '공급자',
  },
  buyer: {
    recipientType: TaxInvoiceRecipientTypes.Business,
    businessNumber: '8888888888',
    companyName: '공급받는자',
  },
  paymentSummary: {
    totalSupplyCostAmount: '10000',
    totalTaxAmount: '1000',
    totalAmount: '11000',
  },
  lineItems: [{ lineNumber: 1, itemName: '테스트 품목', supplyCostAmount: '10000', taxAmount: '1000' }],
  additionalContacts: [{ sequenceNumber: 1, contactName: '담당자', emailAddress: 'test@test.com' }],
}

describe('tax-invoice document mapper', () => {
  test('maps one document into compat api model shape with cloned nested arrays', () => {
    const mapped = mapTaxInvoiceDocument(TAX_INVOICE_DOCUMENT)

    expect(mapped).toMatchObject({
      writeDate: '20260226',
      chargeDirection: '정과금',
      issueType: '정발행',
      purposeType: '영수',
      taxType: '과세',
      invoicerCorpNum: '1234567890',
      invoicerCorpName: '공급자',
      invoiceeType: '사업자',
      invoiceeCorpNum: '8888888888',
      invoiceeCorpName: '공급받는자',
      supplyCostTotal: '10000',
      taxTotal: '1000',
      totalAmount: '11000',
      detailList: [{ serialNum: 1, itemName: '테스트 품목', supplyCost: '10000', tax: '1000' }],
      addContactList: [{ serialNum: 1, contactName: '담당자', email: 'test@test.com' }],
    })
    expect(mapped).not.toBe(TAX_INVOICE_DOCUMENT)
    expect(mapped.detailList).not.toBe(TAX_INVOICE_DOCUMENT.lineItems)
    expect(mapped.detailList?.[0]).not.toBe(TAX_INVOICE_DOCUMENT.lineItems?.[0])
    expect(mapped.addContactList).not.toBe(TAX_INVOICE_DOCUMENT.additionalContacts)
    expect(mapped.addContactList?.[0]).not.toBe(TAX_INVOICE_DOCUMENT.additionalContacts?.[0])
  })

  test('maps document list into new compat api model list', () => {
    const documents = [TAX_INVOICE_DOCUMENT]
    const mapped = mapTaxInvoiceDocuments(documents)

    expect(mapped).toEqual([mapTaxInvoiceDocument(TAX_INVOICE_DOCUMENT)])
    expect(mapped).not.toBe(documents)
    expect(mapped[0]).not.toBe(TAX_INVOICE_DOCUMENT)
  })
})
