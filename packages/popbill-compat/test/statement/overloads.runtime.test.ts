import { createStatementPromiseService, createStatementService, type StatementCallbackService, type StatementPromiseService } from '@/factory/index'
import * as helpers from './helpers'

const searchBase: [string, string, string, string, string[], 121[]] = [helpers.CORP_NUM, 'W', '20261101', '20261102', ['200'], [121]]
const searchResponse = { code: 1, message: 'Success', total: 0, perPage: 500, pageNum: 1, pageCount: 0, list: [] }
type Callback = (response: unknown) => void

const callbackSearchCases: {
  name: string
  invoke: (service: StatementCallbackService, success: Callback, error: Callback) => void
  query: Record<string, string | undefined>
  userId?: string
}[] = [
  {
    name: 'short form with default Page and explicit PerPage',
    invoke: (service, success, error) => service.search(...searchBase, 'D', undefined, 10, success, error),
    query: { Order: 'D', PerPage: '10' },
  },
  {
    name: 'short form with default Page and userId',
    invoke: (service, success, error) => service.search(...searchBase, 'D', undefined, 10, helpers.USER_ID, success, error),
    query: { Order: 'D', PerPage: '10' },
    userId: helpers.USER_ID,
  },
  {
    name: 'short form with default Page and PerPage',
    invoke: (service, success, error) => service.search(...searchBase, 'D', undefined, undefined, success, error),
    query: { Order: 'D' },
  },
  {
    name: 'short form with omitted pagination',
    invoke: (service, success, error) => service.search(...searchBase, 'D', success, error),
    query: { Order: 'D' },
  },
  {
    name: 'full form with default Page and userId',
    invoke: (service, success, error) => service.search(...searchBase, '검색어', 'A', undefined, 10, helpers.USER_ID, success, error),
    query: { QString: '검색어', Order: 'A', PerPage: '10' },
    userId: helpers.USER_ID,
  },
  {
    name: 'full form with omitted pagination',
    invoke: (service, success, error) => service.search(...searchBase, undefined, 'D', success, error),
    query: { Order: 'D' },
  },
  {
    name: 'full form with default Order and explicit userId slot',
    invoke: (service, success, error) => service.search(...searchBase, 'D', undefined, undefined, 10, helpers.USER_ID, success, error),
    query: { QString: 'D', PerPage: '10' },
    userId: helpers.USER_ID,
  },
  {
    name: 'full form with default Order and explicit undefined trailing slots',
    invoke: (service, success, error) => service.search(...searchBase, 'A', undefined, undefined, undefined, undefined, success, error),
    query: { QString: 'A' },
  },
  {
    name: 'short form with default Order and Page',
    invoke: (service, success, error) => service.search(...searchBase, undefined, undefined, 10, success, error),
    query: { PerPage: '10' },
  },
  {
    name: 'full form with omitted optional filters',
    invoke: (service, success, error) =>
      service.search(
        helpers.CORP_NUM,
        'W',
        '20261101',
        '20261102',
        undefined,
        undefined,
        undefined,
        'D',
        undefined,
        undefined,
        undefined,
        success,
        error
      ),
    query: { Order: 'D', State: undefined, ItemCode: undefined },
  },
]

const promiseSearchCases: {
  name: string
  invoke: (service: StatementPromiseService) => Promise<unknown>
  query: Record<string, string>
  userId?: string
}[] = [
  {
    name: 'short form with default Page and explicit PerPage',
    invoke: (service) => service.search(...searchBase, 'D', undefined, 10),
    query: { Order: 'D', PerPage: '10' },
  },
  {
    name: 'short form with default Page and userId',
    invoke: (service) => service.search(...searchBase, 'D', undefined, 10, helpers.USER_ID),
    query: { Order: 'D', PerPage: '10' },
    userId: helpers.USER_ID,
  },
  {
    name: 'short form with omitted pagination',
    invoke: (service) => service.search(...searchBase, 'D'),
    query: { Order: 'D' },
  },
  {
    name: 'full form with omitted pagination',
    invoke: (service) => service.search(...searchBase, '검색어', 'A'),
    query: { QString: '검색어', Order: 'A' },
  },
  {
    name: 'full form with default Page and userId',
    invoke: (service) => service.search(...searchBase, undefined, 'D', undefined, 10, helpers.USER_ID),
    query: { Order: 'D', PerPage: '10' },
    userId: helpers.USER_ID,
  },
  {
    name: 'full form with default Order and explicit undefined userId slot',
    invoke: (service) => service.search(...searchBase, 'D', undefined, undefined, 10, undefined),
    query: { QString: 'D', PerPage: '10' },
  },
  {
    name: 'short form with default Order and Page',
    invoke: (service) => service.search(...searchBase, undefined, undefined, 10),
    query: { PerPage: '10' },
  },
]

afterEach(() => vi.unstubAllGlobals())

describe('statement positional optional arguments', () => {
  test.each(callbackSearchCases)('callback search supports $name', async ({ invoke, query, userId }) => {
    const fetchMock = helpers.stubApiResponse(searchResponse)
    await new Promise<unknown>((resolve, reject) => invoke(createStatementService(helpers.config()), resolve, reject))
    const request = helpers.apiRequest(fetchMock)
    const expected = { DType: 'W', SDate: '20261101', EDate: '20261102', State: '200', ItemCode: '121', ...query }
    expect(Object.fromEntries(request.url.searchParams)).toEqual(
      Object.fromEntries(Object.entries(expected).filter(([, value]) => value !== undefined))
    )
    expect((request.init.headers as Record<string, string>)['x-pb-userid']).toBe(userId)
  })

  test.each(promiseSearchCases)('promise search supports $name', async ({ invoke, query, userId }) => {
    const fetchMock = helpers.stubApiResponse(searchResponse)
    await invoke(createStatementPromiseService(helpers.config()))
    const request = helpers.apiRequest(fetchMock)
    expect(Object.fromEntries(request.url.searchParams)).toEqual({
      DType: 'W',
      SDate: '20261101',
      EDate: '20261102',
      State: '200',
      ItemCode: '121',
      ...query,
    })
    expect((request.init.headers as Record<string, string>)['x-pb-userid']).toBe(userId)
  })

  test.each(['issue', 'cancel', 'registIssue'] as const)('%s accepts an omitted Memo with both callback slots', async (method) => {
    const fetchMock = helpers.stubApiResponse({ code: 1, message: 'Success' })
    const service = createStatementService(helpers.config())
    await new Promise<unknown>((resolve, reject) => {
      if (method === 'registIssue') service.registIssue(helpers.CORP_NUM, helpers.document(), undefined, resolve, reject)
      else if (method === 'issue') service.issue(helpers.CORP_NUM, 121, 'STMT-001', undefined, resolve, reject)
      else service.cancel(helpers.CORP_NUM, 121, 'STMT-001', undefined, resolve, reject)
    })
    const request = helpers.apiRequest(fetchMock)
    expect(JSON.parse(request.init.body as string)).not.toHaveProperty('memo')
    expect(request.init.headers).not.toHaveProperty('x-pb-userid')
  })

  test.each(['issue', 'cancel', 'registIssue'] as const)('%s preserves userId after an omitted Memo', async (method) => {
    const fetchMock = helpers.stubApiResponse({ code: 1, message: 'Success' })
    const service = createStatementService(helpers.config())
    await new Promise<unknown>((resolve, reject) => {
      if (method === 'registIssue') service.registIssue(helpers.CORP_NUM, helpers.document(), undefined, helpers.USER_ID, resolve, reject)
      else if (method === 'issue') service.issue(helpers.CORP_NUM, 121, 'STMT-001', undefined, helpers.USER_ID, resolve, reject)
      else service.cancel(helpers.CORP_NUM, 121, 'STMT-001', undefined, helpers.USER_ID, resolve, reject)
    })
    const request = helpers.apiRequest(fetchMock)
    expect(JSON.parse(request.init.body as string)).not.toHaveProperty('memo')
    expect((request.init.headers as Record<string, string>)['x-pb-userid']).toBe(helpers.USER_ID)
  })

  test.each(['issue', 'cancel', 'registIssue'] as const)('%s accepts an omitted Memo and explicit undefined error slot', async (method) => {
    const fetchMock = helpers.stubApiResponse({ code: 1, message: 'Success' })
    const service = createStatementService(helpers.config())
    await new Promise<unknown>((resolve) => {
      if (method === 'registIssue') service.registIssue(helpers.CORP_NUM, helpers.document(), undefined, resolve, undefined)
      else if (method === 'issue') service.issue(helpers.CORP_NUM, 121, 'STMT-001', undefined, resolve, undefined)
      else service.cancel(helpers.CORP_NUM, 121, 'STMT-001', undefined, resolve, undefined)
    })
    expect(JSON.parse(helpers.apiRequest(fetchMock).init.body as string)).not.toHaveProperty('memo')
  })
})
