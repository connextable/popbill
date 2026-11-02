import { describeTaxinvoiceIntegration, getTaxinvoiceIntegrationEnv } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: refuse', () => {
  test.skipIf(!getTaxinvoiceIntegrationEnv().counterpartUserId)(
    'refuse succeeds (requires POPBILL_COUNTERPART_USER_ID)',
    async () => {
      const context = testkit.createTaxinvoiceMethodContext()
      const keys = await testkit.createReverseRequestedInvoice(context, 'RRF')

      testkit.expectApiSuccess(
        await context.service.refuse(
          context.env.counterpartCorpNum,
          'SELL',
          keys.refuseManagementKey,
          'integration reverse request refuse',
          context.env.counterpartUserId
        )
      )
    },
    180_000
  )
})
