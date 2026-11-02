import { afterEach, expect, it, vi } from 'vitest'
import { createPopbillClient } from '@/index'

afterEach(() => vi.unstubAllGlobals())

it.each([false, null, [], { complete: false, receipts: [{ providerState: 0, extra: null }] }].map((providerResponse) => ({ providerResponse })))(
  'sends receipt numbers through the public client and preserves the undocumented response: $providerResponse',
  async ({ providerResponse }) => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ session_token: 'state-token', expiration: '2100-01-01T00:00:00Z' }))
      .mockResolvedValueOnce(Response.json(providerResponse))
    vi.stubGlobal('fetch', fetchMock)
    const client = createPopbillClient({
      linkId: 'LINK',
      secretKey: Buffer.from('secret').toString('base64'),
      userId: 'state-user',
      isTest: true,
    })
    const receiptNumbers = Object.freeze(['026110300000000001', '026110300000000002'])
    const response = await client.services.message.getMessageStatesByReceiptNumbers({ businessNumber: '1234567890', receiptNumbers })
    expect(response).toEqual(providerResponse)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [target, init] = fetchMock.mock.calls[1]!
    expect(target).toBe('https://popbill-test.linkhub.co.kr/Message/States')
    expect(init?.method).toBe('POST')
    expect(init?.body).toBe(JSON.stringify(receiptNumbers))
    const headers = new Headers(init?.headers)
    expect(headers.get('Authorization')).toBe('Bearer state-token')
    expect(headers.get('x-pb-userid')).toBe('state-user')
  }
)
