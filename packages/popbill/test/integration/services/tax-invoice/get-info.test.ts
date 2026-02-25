import { createPopbillClient } from '@/index'
import type { TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'

const linkId = process.env.POPBILL_LINK_ID?.trim()
const secretKey = process.env.POPBILL_SECRET_KEY?.trim()
const businessNumber = process.env.POPBILL_CORP_NUM?.trim()
const userId = process.env.POPBILL_USER_ID?.trim()
const shouldRunIntegration = process.env.POPBILL_RUN_INTEGRATION_TESTS === 'true'
const invoiceKeyType: TaxInvoiceMgtKeyType = 'SELL'
const invoiceManagementKey = 'REPLACE_WITH_PARTNER_ASSIGNED_MGT_KEY'
const hasConfiguredManagementKey = invoiceManagementKey !== 'REPLACE_WITH_PARTNER_ASSIGNED_MGT_KEY'

const isRunnable = shouldRunIntegration && Boolean(linkId && secretKey && businessNumber && hasConfiguredManagementKey)
const testable = isRunnable ? test : test.skip

describe('integration tax-invoice getInvoiceInfo', () => {
  testable('calls popbill getInvoiceInfo API using fixed keyType and partner-assigned key', async () => {
    const client = createPopbillClient({
      linkId: linkId as string,
      secretKey: secretKey as string,
      isTest: true,
    })

    const response = await client.services.taxInvoice.getInvoiceInfo({
      businessNumber: businessNumber as string,
      invoiceDocumentKeyType: invoiceKeyType,
      invoiceManagementKey,
    }, { userId })

    expect(typeof response.stateCode).toBe('number')
  })
})
