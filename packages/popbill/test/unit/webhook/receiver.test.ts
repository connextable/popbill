import fixtures from '../../fixtures/webhook-events.json'
import { createPopbillWebhookReceiver, PopbillWebhookError, type PopbillWebhookMessage } from '../../../src/webhook'

const receiver = createPopbillWebhookReceiver({ authentication: { type: 'none' } })
const metadata = { 'Pb-Webhook-Type': 'TAXINVOICE.STATE', 'Pb-Webhook-MID': 'message-1', 'Pb-Webhook-Corpnum': '1234567890' }

function receive(body: unknown, webhookType = 'TAXINVOICE.STATE'): PopbillWebhookMessage {
  return receiver.parse({ headers: { ...metadata, 'Pb-Webhook-Type': webhookType }, body })
}

describe('typed webhook receiver', () => {
  test.each(fixtures)('accepts official $name payload', ({ webhookType, expectedKind, payload }) => {
    const message = receive(JSON.stringify(payload), webhookType)
    expect(message.events).toHaveLength(Array.isArray(payload) ? payload.length : 1)
    expect(message.events.every((event) => event.kind === expectedKind)).toBe(true)
    expect(message.rawBody).toEqual(payload)
  })

  test.each([
    ['TAXINVOICE.STATE', { eventType: 'MANUAL', itemKey: 'document' }, 'taxInvoice.state'],
    ['TAXINVOICE.STATE', { eventType: 'MANUAL', submitID: 'submission', receiptID: 'receipt' }, 'taxInvoice.bulkResult'],
    ['CASHBILL.STATE', { eventType: 'MANUAL', itemKey: 'document' }, 'cashbill.state'],
    ['CASHBILL.STATE', { eventType: 'MANUAL', submitID: 'submission', receiptID: 'receipt' }, 'cashbill.bulkResult'],
    ['STATEMENT.STATE', { eventType: 'MANUAL', itemKey: 'document' }, 'statement.state'],
    ['KAKAO.STATE', { eventType: 'MANUAL', receiptNum: 'receipt' }, 'kakao.result'],
    ['SMS.STATE', { eventType: 'MANUAL', receiptNum: 'receipt' }, 'message.result'],
    ['FAX.STATE', { eventType: 'MANUAL', receiptNum: 'receipt' }, 'fax.result'],
  ] as const)('preserves manual event semantics for %s', (webhookType, body, kind) => {
    expect(receive(body, webhookType).events[0]).toMatchObject({ kind, eventType: 'MANUAL' })
  })

  test.each([0, '0', 999, '999', 'future-code', '', null, undefined])('preserves state and flag values %j using shared service mappers', (value) => {
    const event = receive({ eventType: 'Issue', itemKey: 'item', stateCode: value, interOPYN: value }).events[0]!
    expect(event.kind).toBe('taxInvoice.state')
    if (event.kind !== 'taxInvoice.state') throw new Error('Expected state event')
    expect(event.data.stateCode).toBe(value === '0' ? 0 : value === '999' ? 999 : value)
    expect(event.data.isApiLinkedDocument).toBe(value === '0' || value === 0 ? false : value)
    expect(event.raw['stateCode']).toBe(value)
  })

  test('normalizes messaging codes according to each existing service contract', () => {
    const raw = { eventType: 'RESULT', receiptNum: 'receipt', state: '3', result: null, altResult: 'future', tiffFileSize: 17 }
    expect(receive(raw, 'SMS.STATE').events[0]).toMatchObject({ kind: 'message.result', data: { stateCode: '3', resultCode: null } })
    expect(receive(raw, 'KAKAO.STATE').events[0]).toMatchObject({
      kind: 'kakao.result',
      data: { stateCode: 3, resultCode: null, fallbackResultCode: 'future' },
    })
    expect(receive(raw, 'FAX.STATE').events[0]).toMatchObject({ kind: 'fax.result', data: { stateCode: 3, resultCode: null, convertedFileSize: 17 } })
  })

  test('retains unknown types and event codes without classifying them as known transitions', () => {
    const raw = { eventType: 'FUTURE', extra: { value: 1 } }
    for (const webhookType of ['TAXINVOICE.STATE', 'CASHBILL.STATE', 'STATEMENT.STATE', 'KAKAO.STATE', 'SMS.STATE', 'FAX.STATE', 'FUTURE.TYPE']) {
      expect(receive(raw, webhookType).events[0]).toMatchObject({ kind: 'unknown', webhookType, eventType: 'FUTURE', raw, data: raw })
    }
  })

  test('preserves future payload metadata without interpreting a different schema', () => {
    const raw = { eventType: { revision: 2 }, eventDT: { utc: 1 }, future: true }
    expect(receive(raw, 'FUTURE.TYPE').events[0]).toMatchObject({ kind: 'unknown', data: raw, raw })
    const futureEvent = { eventType: 'FUTURE', eventDT: { utc: 1 } }
    expect(receive(futureEvent).events[0]).toMatchObject({ kind: 'unknown', data: futureEvent, raw: futureEvent })
  })

  test('keeps missing party details absent on state callbacks', () => {
    const event = receive({ eventType: 'Issue', itemKey: 'item' }).events[0]!
    if (event.kind !== 'taxInvoice.state') throw new Error('Expected state event')
    expect(event.data.itemKey).toBe('item')
    expect(event.data.supplierCompanyName).toBeUndefined()
    expect(event.data.supplierBusinessNumber).toBeUndefined()
  })

  test('retains HomeTax document identity, money, and timestamps without inventing eventType or occurredAt', () => {
    const raw = { ntsconfirmNum: '0000123', supplyCostTotal: '000100', writeDate: '20261103', issueDT: '20261103090000', sendDate: '20261103' }
    const event = receive(raw, 'HT.TAXINVOICEXML').events[0]!
    expect(event).toMatchObject({
      kind: 'homeTaxTaxInvoice.collected',
      data: { confirmationNumber: '0000123', totalSupplyCostAmount: '000100', issuedAt: '20261103090000', sentDate: '20261103' },
    })
    expect(event.eventType).toBeUndefined()
    expect(event.occurredAt).toBeUndefined()
  })

  test('keeps delivery membership separate from the body and per-item membership', () => {
    const message = receive([
      { header: { CORPNUM: '2222222222', QMNum: 'q-1' }, body: { corpNum: '3333333333', eventType: 'NTS', itemKey: 'a' } },
      { header: { TYPE: 'CASHBILL.STATE', QMNum: 'q-2' }, body: { eventType: 'NTS', itemKey: 'b' } },
    ])
    expect(message.businessNumber).toBe('1234567890')
    expect(message.events[0]).toMatchObject({
      businessNumber: '2222222222',
      data: { businessNumber: '3333333333' },
      batchHeader: { QMNum: 'q-1' },
      index: 0,
    })
    expect(message.events[1]).toMatchObject({ kind: 'cashbill.state', businessNumber: '1234567890', index: 1 })
  })

  test('preserves input order when document transitions arrive out of chronological order', () => {
    const body = [
      { header: {}, body: { eventType: 'CancelIssue', eventDT: '20261103100000', itemKey: 'document' } },
      { header: {}, body: { eventType: 'Issue', eventDT: '20261103090000', itemKey: 'document' } },
    ]
    const message = receive(body)
    expect(message.events).toMatchObject([
      { index: 0, eventType: 'CancelIssue', occurredAt: '20261103100000', data: { itemKey: 'document' }, raw: body[0]!.body },
      { index: 1, eventType: 'Issue', occurredAt: '20261103090000', data: { itemKey: 'document' }, raw: body[1]!.body },
    ])
    expect(message.rawBody).toEqual(body)
  })

  test.each([
    ['TAXINVOICE.STATE', { eventType: 'Issue' }],
    ['TAXINVOICE.STATE', { eventType: 'BULK.RESULT', submitID: 's', receiptID: 'r', issueResult: [null] }],
    ['TAXINVOICE.STATE', { eventType: 'BULK.RESULT', submitID: 's', receiptID: 'r', issueResult: {} }],
    ['TAXINVOICE.STATE', { itemKey: 'item' }],
    ['HT.TAXINVOICEXML', { ntsconfirmNum: 'id', detailList: [null] }],
    ['HT.CASHBILL', {}],
    ['SMS.STATE', { eventType: 'RESULT' }],
    ['FAX.STATE', { eventType: 'RESULT', receiptNum: 'r', fileNames: {} }],
  ] as const)('rejects malformed known %s payload instead of acknowledging an unknown event', (webhookType, body) => {
    expect(() => receive(body, webhookType)).toThrow(expect.objectContaining({ code: 'INVALID_PAYLOAD' }))
  })

  test('rejects a broken later event instead of returning a partial batch', () => {
    expect(() =>
      receive([
        { header: {}, body: { eventType: 'Issue', itemKey: 'item' } },
        { header: {}, body: { eventType: 'Issue' } },
      ])
    ).toThrow(PopbillWebhookError)
  })

  test('accepts both certificate policy spellings without dropping either raw value', () => {
    for (const policy of [{ OID: 'uppercase' }, { oid: 'lowercase' }]) {
      expect(receive({ corpNum: '1234567890', eventType: 'REGIST', ...policy }).events[0]).toMatchObject({
        kind: 'taxInvoice.certificate',
        data: { policyIdentifier: Object.values(policy)[0] },
        raw: policy,
      })
    }
  })

  test('validates authentication through the public receiver and produces the documented acknowledgement', () => {
    const authenticated = createPopbillWebhookReceiver({ authentication: { type: 'apiKey', apiKey: 'secret' } })
    expect(() => authenticated.parse({ headers: metadata, body: {} })).toThrow(expect.objectContaining({ code: 'AUTHENTICATION_FAILED' }))
    expect(authenticated.createSuccessResponse()).toEqual({
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: '{"result":"OK"}',
    })
  })
})
