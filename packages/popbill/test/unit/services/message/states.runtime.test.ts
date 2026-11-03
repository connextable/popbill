import { afterEach, expect, it, vi } from 'vitest'
import { createPopbillClient } from '@/index'

afterEach(() => vi.unstubAllGlobals())

it.each(['getMessagesByReceiptNumber', 'getMessagesByRequestNumber', 'searchMessages'] as const)(
  '%s preserves null codes, normalizes numeric zero and retains provider strings',
  async (method) => {
    const providerMessages = [null, 0, '000', 'FUTURE', undefined].map((code) => ({ state: code, result: code }))
    const providerResponse =
      method === 'searchMessages'
        ? { code: 1, message: 'OK', pageNum: 1, perPage: 100, pageCount: 1, total: providerMessages.length, list: providerMessages }
        : providerMessages
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
    const message = client.services.message
    const businessNumber = '1234567890'
    const response =
      method === 'getMessagesByReceiptNumber'
        ? await message.getMessagesByReceiptNumber({ businessNumber, receiptNumber: '026110300000000001' })
        : method === 'getMessagesByRequestNumber'
          ? await message.getMessagesByRequestNumber({ businessNumber, requestNumber: 'REQUEST-1' })
          : await message.searchMessages({ businessNumber, startDate: '20261101', endDate: '20261103', stateCodes: ['1'] })
    const messages = Array.isArray(response) ? response : response.items
    expect(messages.map(({ stateCode, resultCode }) => ({ stateCode, resultCode }))).toEqual(
      [null, '0', '000', 'FUTURE', undefined].map((code) => ({ stateCode: code, resultCode: code }))
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
  }
)

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
