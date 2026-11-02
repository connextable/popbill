import type { TaxinvoiceCallbackService } from '@/services/taxinvoice/types'
import * as helpers from './helpers'

interface CallbackCase {
  name: string
  binary?: boolean
  invoke: (service: TaxinvoiceCallbackService, error: (value: unknown) => void) => void
}

const cases: CallbackCase[] = [
  { name: 'existing getInfo without UserID', invoke: (s, e) => s.getInfo('1234567890', 'SELL', 'KEY', undefined, e) },
  { name: 'getChargeInfo without UserID', invoke: (s, e) => s.getChargeInfo('1234567890', undefined, e) },
  { name: 'getUnitCost', invoke: (s, e) => s.getUnitCost('1234567890', undefined, e) },
  { name: 'cancelSend without UserID', invoke: (s, e) => s.cancelSend('1234567890', 'SELL', 'KEY', 'memo', undefined, e) },
  { name: 'accept without UserID', invoke: (s, e) => s.accept('1234567890', 'SELL', 'KEY', 'memo', undefined, e) },
  { name: 'deny without UserID', invoke: (s, e) => s.deny('1234567890', 'SELL', 'KEY', 'memo', undefined, e) },
  { name: 'getOldPrintURL without UserID', invoke: (s, e) => s.getOldPrintURL('1234567890', 'SELL', 'KEY', undefined, e) },
  { name: 'getEmailPublicKeys without UserID', invoke: (s, e) => s.getEmailPublicKeys('1234567890', undefined, e) },
  { name: 'getPDF without UserID', binary: true, invoke: (s, e) => s.getPDF('1234567890', 'SELL', 'KEY', undefined, e) },
  { name: 'getPDF with UserID', binary: true, invoke: (s, e) => s.getPDF('1234567890', 'SELL', 'KEY', 'user', undefined, e) },
  { name: 'getPDF with copy selector', binary: true, invoke: (s, e) => s.getPDF('1234567890', 'SELL', 'KEY', 'user', '1', undefined, e) },
  {
    name: 'getPDF with undefined copy selector',
    binary: true,
    invoke: (s, e) => s.getPDF('1234567890', 'SELL', 'KEY', 'user', undefined, undefined, e),
  },
  { name: 'send without UserID', invoke: (s, e) => s.send('1234567890', 'SELL', 'KEY', 'memo', undefined, e) },
  { name: 'send with UserID', invoke: (s, e) => s.send('1234567890', 'SELL', 'KEY', 'memo', 'user', undefined, e) },
  { name: 'send with title and default UserID', invoke: (s, e) => s.send('1234567890', 'SELL', 'KEY', 'memo', 'title', undefined, undefined, e) },
]

const customCases: { method: 'registIssue' | 'bulkSubmit' | 'issue' | 'search' | 'registRequest'; required: unknown[]; options: unknown[][] }[] = [
  {
    method: 'registIssue',
    required: ['1234567890', { issueType: '정발행' }],
    options: [
      [],
      [false],
      [false, false],
      [false, false, 'memo'],
      [false, false, 'memo', 'subject'],
      [false, false, 'memo', 'subject', 'deal'],
      [false, false, 'memo', 'subject', 'deal', 'user'],
    ],
  },
  { method: 'bulkSubmit', required: ['1234567890', 'SUBMIT-1', [{ issueType: '정발행' }]], options: [[], [false], [false, 'user']] },
  {
    method: 'issue',
    required: ['1234567890', 'SELL', 'KEY'],
    options: [[], ['memo'], ['memo', 'user'], ['memo', false, 'user'], ['memo', 'subject', false, 'user']],
  },
  {
    method: 'search',
    required: ['1234567890', 'SELL', 'W', '20260101', '20260131', [], [], [], null, 'D', 1, 100],
    options: [
      [],
      ['user'],
      ['S', '1', '1234'],
      ['S', '1', '1234', 'user'],
      ['S', '1', '1234', 'query', 'user'],
      ['S', '1', '1234', 'query', '0', 'user'],
      ['S', '1', '1234', 'query', '0', 'user', ['N']],
      ['S', '1', '1234', 'query', '0', 'user', ['N'], ['P'], ['0'], 'KEY'],
    ],
  },
  { method: 'registRequest', required: ['1234567890', { issueType: '역발행' }], options: [[], ['memo'], ['memo', 'user']] },
]
for (const { method, required, options } of customCases) {
  for (const [index, values] of options.entries()) {
    cases.push({
      name: `${method} legacy optional prefix ${index}`,
      invoke: (service, error) => {
        const call = service[method] as (...args: unknown[]) => void
        call(...required, ...values, undefined, error)
      },
    })
  }
}

describe('legacy optional UserID callback arity', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test.each(cases)('$name delivers API errors only to the explicit error callback', async ({ invoke }) => {
    const defaultError = vi.fn<(error: unknown) => void>()
    const error = vi.fn<(error: unknown) => void>()
    helpers.configureCompat(defaultError)
    helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -12345, message: 'failed' }, 400)
    )
    invoke(helpers.compat.TaxinvoiceService(), error)
    await vi.waitFor(() => expect(error.mock.calls.length + defaultError.mock.calls.length).toBe(1))
    expect(error).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ code: -12345 }))
    expect(defaultError).not.toHaveBeenCalled()
  })

  test.each(cases)('$name never calls the error callback on successful responses', async ({ invoke, binary }) => {
    const defaultError = vi.fn<(error: unknown) => void>()
    const error = vi.fn<(error: unknown) => void>()
    helpers.configureCompat(defaultError)
    const response = binary
      ? new Response(new Uint8Array([0, 255]), { headers: { 'Content-Type': 'application/pdf' } })
      : helpers.toJsonResponse({ code: 1, message: 'OK', unitCost: '10', url: 'https://example.com/view' })
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), response)
    invoke(helpers.compat.TaxinvoiceService(), error)
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    await new Promise<void>((resolve) => setImmediate(resolve))
    expect(error).not.toHaveBeenCalled()
    expect(defaultError).not.toHaveBeenCalled()
  })

  test('existing getInfo supports an explicit undefined UserID with both callback slots', async () => {
    helpers.configureCompat()
    helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse({ stateCode: 300 }))
    const result = await new Promise<unknown>((resolve, reject) =>
      helpers.compat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'KEY', undefined, resolve, reject)
    )
    expect(result).toMatchObject({ stateCode: 300 })
  })
})
