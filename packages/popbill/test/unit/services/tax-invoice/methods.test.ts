import { createPopbillClient } from '@/client'
import { TAX_INVOICE_METHODS } from '@/services/tax-invoice'

const READ_METHODS = [
  'getBulkIssueSubmissionResult',
  'getInvoiceInfo',
  'getInvoicesInfo',
  'getInvoiceDetailInfo',
  'getInvoiceXML',
  'getInvoiceLogs',
  'getTaxInvoiceBoxURL',
  'getInvoicePopupURL',
  'getInvoiceViewURL',
  'getSupplierInvoicePrintURL',
  'getBuyerInvoicePrintURL',
  'getBulkInvoicePrintURL',
  'getInvoiceMailURL',
  'getInvoicePDFURL',
  'getSealAndAttachmentRegistrationURL',
  'getAttachedFiles',
  'getEmailSendSettings',
  'getSendToNTSSettings',
  'getTaxCertificateRegistrationURL',
  'getTaxCertificateExpirationDate',
  'getTaxCertificateInfo',
] as const

const CHECK_METHODS = [
  'checkInvoiceManagementKeyInUse',
  'checkTaxCertificateValidation',
] as const

describe('tax-invoice methods surface', () => {
  test('exposes all 46 modern facade methods', () => {
    expect(TAX_INVOICE_METHODS).toHaveLength(46)

    const client = createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      isTest: true,
    })

    for (const methodName of TAX_INVOICE_METHODS) {
      expect(typeof client.services.taxInvoice[methodName]).toBe('function')
    }
  })

  test('uses get/check prefixes for read and predicate methods', () => {
    for (const methodName of READ_METHODS) {
      expect(methodName.startsWith('get')).toBe(true)
    }

    for (const methodName of CHECK_METHODS) {
      expect(methodName.startsWith('check')).toBe(true)
    }
  })

  test('does not expose forbidden abbreviations in public method names', () => {
    const forbiddenTokens = ['mgt', 'corpnum', 'dtype', 'qstring', 'yn']

    for (const methodName of TAX_INVOICE_METHODS) {
      const lowerMethodName = methodName.toLowerCase()

      for (const forbiddenToken of forbiddenTokens) {
        expect(lowerMethodName.includes(forbiddenToken)).toBe(false)
      }
    }
  })
})
