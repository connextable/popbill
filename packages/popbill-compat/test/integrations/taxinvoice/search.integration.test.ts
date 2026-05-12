import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: search', () => {
  test('search succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const response = await context.service.search(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      'R',
      context.searchStartDate,
      context.today,
      ['3**'],
      ['N', 'M'],
      ['T', 'N', 'Z'],
      null,
      'D',
      1,
      100,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      context.userId,
      undefined,
      undefined,
      [0]
    )

    expect(typeof response.code).toBe('number')
    expect(Array.isArray(response.list)).toBe(true)
  }, 180_000)
})
