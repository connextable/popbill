import { createPopbillClient } from '@/index'
import type { TaxInvoiceKeyType } from '@connextable/popbill-spec/tax-invoice'

const linkId = process.env.POPBILL_LINK_ID?.trim()
const secretKey = process.env.POPBILL_SECRET_KEY?.trim()
const businessNumber = process.env.POPBILL_CORP_NUM?.trim()
const userId = process.env.POPBILL_USER_ID?.trim()
const shouldRunIntegration = process.env.POPBILL_RUN_INTEGRATION_TESTS === 'true'
const invoiceKeyType: TaxInvoiceKeyType = 'SELL'
const invoiceManagementKey = 'REPLACE_WITH_PARTNER_ASSIGNED_MGT_KEY'
const hasConfiguredManagementKey = invoiceManagementKey !== 'REPLACE_WITH_PARTNER_ASSIGNED_MGT_KEY'

const isRunnable = shouldRunIntegration && Boolean(linkId && secretKey && businessNumber && hasConfiguredManagementKey)
const testable = isRunnable ? test : test.skip

describe('integration tax-invoice getInfo', () => {
  testable('calls popbill getInfo API using fixed keyType and partner-assigned mgtKey', async () => {
    const client = createPopbillClient({
      linkId: linkId as string,
      secretKey: secretKey as string,
      isTest: true,
    })

    const response = await client.services.taxInvoice.getInfo({
      businessNumber: businessNumber as string,
      invoiceKeyType,
      invoiceManagementKey,
      userId,
    })

    expect(typeof response.stateCode).toBe('number')
  })
})
