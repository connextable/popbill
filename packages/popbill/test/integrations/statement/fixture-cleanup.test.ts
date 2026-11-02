import { createPopbillClient } from '@/index'
import { withOwnedDraftInvoice, type StatementIntegrationContext } from './integration-context'

afterEach(() => vi.unstubAllGlobals())

test('deletes an owned draft invoice when its registration response is lost', async () => {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ session_token: 'mock-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
    .mockRejectedValueOnce(new Error('Registration response lost'))
    .mockResolvedValueOnce(Response.json({ code: 1, message: 'Deleted' }))
  vi.stubGlobal('fetch', fetchMock)
  const client = createPopbillClient({
    linkId: 'MOCK_LINK_ID',
    secretKey: Buffer.from('mock-secret').toString('base64'),
    userId: 'mock-user',
    isTest: true,
  })
  const context: StatementIntegrationContext = {
    client,
    service: client.services.statement,
    businessNumber: '1234567890',
    counterpartBusinessNumber: '8888888888',
  }

  await expect(
    withOwnedDraftInvoice(context, 'OWNED-RESPONSE-LOST', async (key) => {
      await client.services.taxInvoice.registerInvoice({
        businessNumber: key.businessNumber,
        taxInvoiceDocument: { supplier: { businessNumber: key.businessNumber, managementKey: key.invoiceManagementKey } },
      })
    })
  ).rejects.toMatchObject({ message: 'Registration response lost' })

  expect(fetchMock).toHaveBeenCalledTimes(3)
  const [url, options] = fetchMock.mock.calls[2]!
  expect(typeof url === 'string' ? url : url instanceof URL ? url.href : url.url).toContain('/Taxinvoice/SELL/OWNED-RESPONSE-LOST')
  expect(new Headers(options?.headers).get('X-HTTP-Method-Override')).toBe('DELETE')
})
