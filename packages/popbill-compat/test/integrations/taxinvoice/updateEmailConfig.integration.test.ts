import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: updateEmailConfig', () => {
  test('updateEmailConfig succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const settings = await context.service.listEmailConfig(context.businessNumber, context.userId)
    const emailType = settings.find((setting) => typeof setting.emailType === 'string')?.emailType ?? 'TAX_ISSUE'

    testkit.expectApiSuccess(
      await context.service.updateEmailConfig(context.businessNumber, emailType, true, context.userId)
    )
  }, 180_000)
})
