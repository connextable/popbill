import { createPopbillWebhookParser, type PopbillWebhookError, type PopbillWebhookInput } from '../src/webhook'

const metadata = { 'Pb-Webhook-Type': 'TAXINVOICE.STATE', 'Pb-Webhook-MID': 'message-1', 'Pb-Webhook-Corpnum': '1234567890' }
const parser = createPopbillWebhookParser({ authentication: { type: 'apiKey', apiKey: 'private-key' } })
const headers = { ...metadata, 'X-Api-Key': 'private-key' }

function expectCode(callback: () => unknown, code: PopbillWebhookError['code']) {
  expect(callback).toThrow(expect.objectContaining({ name: 'PopbillWebhookError', code }))
}

describe('webhook transport contract', () => {
  test('supports Headers, JSON bytes, and already parsed objects without leaking credentials', () => {
    const body = { eventType: 'Issue', corpNum: '1234567890' }
    for (const input of [body, JSON.stringify(body), new TextEncoder().encode(JSON.stringify(body))]) {
      const result = parser.parse({ headers: new Headers(headers), body: input })
      expect(result).toMatchObject({ messageId: 'message-1', businessNumber: '1234567890', items: [{ body, index: 0 }], rawBody: body })
      expect(JSON.stringify(result)).not.toContain('private-key')
    }
  })

  test('normalizes batch wrappers, retaining per-item metadata and order', () => {
    const body = [
      { header: { QMNum: 'A', TYPE: 'TAXINVOICE.STATE', CORPNUM: '2222222222' }, body: { eventType: 'NTS' } },
      { header: { QMNum: 'B', MEMBERCODE: 'member' }, body: { eventType: 'CLOSEDOWN' } },
    ]
    expect(parser.parse({ headers, body })).toMatchObject({
      rawBody: body,
      items: [
        { index: 0, businessNumber: '2222222222', batchHeader: body[0]!.header },
        { index: 1, businessNumber: '1234567890', webhookType: 'TAXINVOICE.STATE', batchHeader: body[1]!.header },
      ],
    })
    expect(parser.parse({ headers, body: [] }).items).toEqual([])
  })

  test.each(['{', 'null', '1', '"text"', '[null]', '[{}]', '[{"header":{},"body":[]}]'])('rejects invalid payload %s', (body) => {
    expect(() => parser.parse({ headers, body })).toThrow(expect.objectContaining({ code: 'INVALID_PAYLOAD' }))
  })

  test('rejects malformed UTF-8 and malformed metadata without partial batch results', () => {
    expect(() => parser.parse({ headers, body: new Uint8Array([0xff]) })).toThrow(expect.objectContaining({ code: 'INVALID_PAYLOAD' }))
    expectCode(() => parser.parse({ headers, body: [{ header: { TYPE: 12 }, body: {} }] }), 'INVALID_PAYLOAD')
  })

  test('checks authentication before parsing the body and snapshots configuration', () => {
    const authentication = { type: 'apiKey' as const, apiKey: 'secret' }
    const receiver = createPopbillWebhookParser({ authentication })
    authentication.apiKey = 'changed'
    expectCode(() => receiver.parse({ headers, body: '{' }), 'AUTHENTICATION_FAILED')
    expect(receiver.parse({ headers: { ...metadata, 'x-api-key': 'secret' }, body: {} }).items).toHaveLength(1)
    expectCode(() => parser.parse({ headers: metadata, body: {} }), 'AUTHENTICATION_FAILED')
  })

  test('requires explicit authentication and validates credentials at construction', () => {
    for (const config of [
      undefined,
      {},
      { authentication: {} },
      { authentication: { type: 'apiKey', apiKey: '' } },
      { authentication: { type: 'basic', username: 'a:b', password: 'c' } },
    ]) {
      expectCode(() => createPopbillWebhookParser(config as Parameters<typeof createPopbillWebhookParser>[0]), 'INVALID_CONFIGURATION')
    }
    expect(createPopbillWebhookParser({ authentication: { type: 'none' } }).parse({ headers: metadata, body: {} }).messageId).toBe('message-1')
  })

  test('supports Basic credentials with colon-containing passwords and case-insensitive scheme', () => {
    const receiver = createPopbillWebhookParser({ authentication: { type: 'basic', username: 'member', password: 'pass:word' } })
    const authorization = `basic ${Buffer.from('member:pass:word').toString('base64')}`
    expect(receiver.parse({ headers: { ...metadata, Authorization: authorization }, body: {} }).messageId).toBe('message-1')
    for (const invalid of ['Bearer token', 'Basic !!!', 'Basic bWVtYmVyOnBhc3M=']) {
      expectCode(() => receiver.parse({ headers: { ...metadata, Authorization: invalid }, body: {} }), 'AUTHENTICATION_FAILED')
    }
  })

  test('handles header casing, singleton arrays, duplicates, and required metadata', () => {
    expect(parser.parse({ headers: { ...metadata, 'x-api-key': ['private-key'] }, body: {} }).messageId).toBe('message-1')
    for (const altered of [
      { ...headers, 'Pb-Webhook-MID': '' },
      { ...headers, 'pb-webhook-mid': 'duplicate' },
      { ...headers, 'X-Api-Key': ['private-key', 'other'] },
      { ...headers, 'Content-Type': 'text/plain' },
      { ...headers, 'Content-Type': '' },
    ])
      expectCode(() => parser.parse({ headers: altered, body: {} }), 'INVALID_HEADERS')
    expectCode(() => parser.parse({ headers: null, body: {} } as unknown as PopbillWebhookInput), 'INVALID_HEADERS')
  })

  test('returns a fresh framework-neutral acknowledgement without sending it', async () => {
    const ack = parser.createSuccessResponse()
    const response = new Response(ack.body, ack)
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ result: 'OK' })
    ack.headers['content-type'] = 'application/json; charset=utf-8'
    expect(parser.createSuccessResponse()).not.toBe(ack)
  })
})
