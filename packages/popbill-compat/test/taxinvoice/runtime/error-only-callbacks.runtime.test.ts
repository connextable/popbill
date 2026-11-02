import { createTaxinvoiceService, type TaxinvoiceCallbackService } from '@/factory/index'
import * as helpers from './helpers'

const errorOnlyCalls: {
  name: string
  invoke: (service: TaxinvoiceCallbackService, corpNum: string, error: (error: unknown) => void) => void
}[] = [
  {
    name: 'registIssue without userId',
    invoke: (service, corpNum, error) => {
      service.registIssue(corpNum, { issueType: '정발행' }, undefined, true, undefined, 'subject', undefined, undefined, error)
    },
  },
  {
    name: 'registIssue with userId',
    invoke: (service, corpNum, error) => {
      service.registIssue(corpNum, { issueType: '정발행' }, false, true, 'memo', 'subject', 'DEAL-1', 'issue-user', undefined, error)
    },
  },
  {
    name: 'search with optional filter slots',
    invoke: (service, corpNum, error) => {
      service.search(
        corpNum,
        'SELL',
        'W',
        '20260101',
        '20260131',
        [],
        [],
        [],
        null,
        'D',
        1,
        100,
        undefined,
        undefined,
        undefined,
        'query',
        undefined,
        'search-user',
        undefined,
        undefined,
        undefined,
        'MGT-1',
        undefined,
        error
      )
    },
  },
]

describe('taxinvoice runtime: error-only callbacks', () => {
  let service: TaxinvoiceCallbackService
  let defaultErrorHandler: ReturnType<typeof vi.fn<(error: unknown) => void>>

  beforeEach(() => {
    defaultErrorHandler = vi.fn<(error: unknown) => void>()
    service = createTaxinvoiceService({
      LinkID: 'TEST_LINK_ID',
      SecretKey: Buffer.from('secret').toString('base64'),
      IsTest: true,
      defaultErrorHandler,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test.each(errorOnlyCalls)('$name routes API errors to the explicit error callback', async ({ invoke }) => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -12345, message: 'Bad request' }, 400)
    )
    const errorCallback = vi.fn<(error: unknown) => void>()

    invoke(service, '1234567890', errorCallback)

    await vi.waitFor(() => {
      expect(errorCallback.mock.calls.length + defaultErrorHandler.mock.calls.length).toBe(1)
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(errorCallback).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ code: -12345, stage: 'request_api' }))
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test.each(errorOnlyCalls)('$name does not invoke the error callback on success', async ({ invoke }) => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'Success', receiptID: 'RECEIPT-1', list: [] })
    )
    const errorCallback = vi.fn<(error: unknown) => void>()

    invoke(service, '1234567890', errorCallback)

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(errorCallback).not.toHaveBeenCalled()
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })
})
