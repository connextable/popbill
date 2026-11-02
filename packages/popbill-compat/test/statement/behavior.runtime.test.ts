import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import { createStatementPromiseService, createStatementService, type StatementCallbackService, type StatementPromiseService } from '@/factory/index'
import type * as Spec from '@connextable/popbill-spec'
import * as helpers from './helpers'

const ok = { code: 1, message: 'Success' }

function failingHandler(style: 'sync' | 'async') {
  return vi.fn<(error: unknown) => void | Promise<never>>(() => {
    if (style === 'async') return Promise.reject(new Error('handler failed'))
    throw new Error('handler failed')
  })
}

const documentWrites: {
  name: string
  invoke: (service: StatementPromiseService, input: Spec.StatementApiModel) => Promise<unknown>
  extraBody: Record<string, string>
  response: unknown
}[] = [
  {
    name: 'register',
    invoke: (service, input) => service.register(helpers.CORP_NUM, input, helpers.USER_ID),
    extraBody: {},
    response: ok,
  },
  {
    name: 'update',
    invoke: (service, input) => service.update(helpers.CORP_NUM, 121, 'STMT-001', input, helpers.USER_ID),
    extraBody: {},
    response: ok,
  },
  {
    name: 'registIssue',
    invoke: (service, input) => service.registIssue(helpers.CORP_NUM, input, '메모', helpers.USER_ID, '제목'),
    extraBody: { memo: '메모', emailSubject: '제목' },
    response: ok,
  },
  {
    name: 'FAXSend',
    invoke: (service, input) => service.FAXSend(helpers.CORP_NUM, input, '07075103710', '0212345678', helpers.USER_ID),
    extraBody: { sendNum: '07075103710', receiveNum: '0212345678' },
    response: { receiptNum: 'FAX-001' },
  },
]

describe('statement runtime: factories and legacy overloads', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('typed factories and singleton entrypoints expose the statement services', async () => {
    const callback: StatementCallbackService = createStatementService(helpers.config())
    const promise: StatementPromiseService = createStatementPromiseService(helpers.config())
    expectTypeOf<StatementCallbackService['getInfo']>().returns.toEqualTypeOf<void>()
    expectTypeOf<StatementPromiseService['getInfo']>().returns.toEqualTypeOf<Promise<Spec.StatementInfoApiModel>>()
    const callbackEntrypoint: () => StatementCallbackService = compat.StatementService
    const promiseEntrypoint: () => StatementPromiseService = promiseCompat.StatementService
    expectTypeOf(callbackEntrypoint).returns.toEqualTypeOf<StatementCallbackService>()
    expectTypeOf(promiseEntrypoint).returns.toEqualTypeOf<StatementPromiseService>()
    await expect(Promise.resolve(callback)).resolves.toBe(callback)
    await expect(Promise.resolve(promise)).resolves.toBe(promise)

    compat.config(helpers.config())
    const callbackFetch = helpers.stubApiResponse({ itemKey: 'CALLBACK-ITEM' })
    const callbackResult = await new Promise<unknown>((resolve, reject) => {
      compat.StatementService().getInfo(helpers.CORP_NUM, 121, 'STMT-001', resolve, reject)
    })
    expect(callbackResult).toEqual({ itemKey: 'CALLBACK-ITEM' })
    expect(helpers.apiRequest(callbackFetch).init.headers).not.toHaveProperty('x-pb-userid')

    promiseCompat.config(helpers.config())
    helpers.stubApiResponse({ itemKey: 'PROMISE-ITEM' })
    await expect(promiseCompat.StatementService().getInfo(helpers.CORP_NUM, 121, 'STMT-001')).resolves.toEqual({ itemKey: 'PROMISE-ITEM' })
  })

  test('factory snapshots the error handler when a caller reuses the config object', async () => {
    const firstHandler = vi.fn<(error: unknown) => void>()
    const secondHandler = vi.fn<(error: unknown) => void>()
    const config = helpers.config(firstHandler)
    const first = createStatementPromiseService(config)
    config.defaultErrorHandler = secondHandler
    const second = createStatementPromiseService(config)

    await expect(first.getInfo('', 121, 'STMT-001')).rejects.toMatchObject({ code: -99999999 })
    expect(firstHandler).toHaveBeenCalledTimes(1)
    expect(secondHandler).not.toHaveBeenCalled()
    await expect(second.getInfo('', 121, 'STMT-002')).rejects.toMatchObject({ code: -99999999 })
    expect(secondHandler).toHaveBeenCalledTimes(1)
  })

  test('callback factory also snapshots the error handler', async () => {
    const firstHandler = vi.fn<(error: unknown) => void>()
    const secondHandler = vi.fn<(error: unknown) => void>()
    const config = helpers.config(firstHandler)
    const first = createStatementService(config)
    config.defaultErrorHandler = secondHandler
    const second = createStatementService(config)

    first.getInfo('', 121, 'STMT-001')
    await vi.waitFor(() => {
      expect(firstHandler).toHaveBeenCalledTimes(1)
    })
    expect(secondHandler).not.toHaveBeenCalled()
    second.getInfo('', 121, 'STMT-002')
    await vi.waitFor(() => {
      expect(secondHandler).toHaveBeenCalledTimes(1)
    })
  })

  test.each([
    { name: 'no options', options: [], body: {}, userId: undefined },
    { name: 'memo', options: ['메모'], body: { memo: '메모' }, userId: undefined },
    { name: 'memo and userId', options: ['메모', helpers.USER_ID], body: { memo: '메모' }, userId: helpers.USER_ID },
    { name: 'full', options: ['메모', '제목', helpers.USER_ID], body: { memo: '메모', emailSubject: '제목' }, userId: helpers.USER_ID },
  ])('callback issue supports $name legacy overload', async ({ options, body, userId }) => {
    const fetchMock = helpers.stubApiResponse(ok)
    const service = createStatementService(helpers.config())
    await new Promise<unknown>((resolve, reject) => {
      helpers.invoke(service, 'issue', [helpers.CORP_NUM, 121, 'STMT-001', ...options, resolve, reject])
    })

    const { init } = helpers.apiRequest(fetchMock)
    expect(JSON.parse(init.body as string)).toEqual(body)
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe(userId)
  })

  test('callback registIssue preserves the memo, userId, subject order without changing the document', async () => {
    const input = Object.freeze(helpers.document())
    const expectedInput = helpers.document()
    const fetchMock = helpers.stubApiResponse(ok)
    await new Promise<unknown>((resolve, reject) => {
      createStatementService(helpers.config()).registIssue(helpers.CORP_NUM, input, '발행 메모', helpers.USER_ID, '메일 제목', resolve, reject)
    })

    const { init } = helpers.apiRequest(fetchMock)
    expect(JSON.parse(init.body as string)).toEqual({ ...expectedInput, memo: '발행 메모', emailSubject: '메일 제목' })
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe(helpers.USER_ID)
    expect(input).toEqual(expectedInput)
  })

  test('callback getInfo preserves success with an omitted userId and explicit undefined error slot', async () => {
    const response = { itemKey: 'ITEM-001', mgtKey: 'STMT-001' }
    const fetchMock = helpers.stubApiResponse(response)
    const success = vi.fn<(response: Spec.StatementInfoApiModel) => void>()
    const defaultErrorHandler = vi.fn<(error: unknown) => void>()
    createStatementService(helpers.config(defaultErrorHandler)).getInfo(helpers.CORP_NUM, 121, 'STMT-001', undefined, success, undefined)
    await vi.waitFor(() => {
      expect(success).toHaveBeenCalledExactlyOnceWith(response)
    })

    const { url, init } = helpers.apiRequest(fetchMock)
    expect(url.pathname).toBe('/Statement/121/STMT-001')
    expect(init.method).toBe('GET')
    expect(init.body).toBeUndefined()
    expect(init.headers).not.toHaveProperty('x-pb-userid')
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('callback issue preserves success with an omitted full-form userId and explicit undefined error slot', async () => {
    const fetchMock = helpers.stubApiResponse(ok)
    const success = vi.fn<(response: Spec.StatementIssueApiResponse) => void>()
    const defaultErrorHandler = vi.fn<(error: unknown) => void>()
    createStatementService(helpers.config(defaultErrorHandler)).issue(
      helpers.CORP_NUM,
      121,
      'STMT-001',
      '메모',
      '제목',
      undefined,
      success,
      undefined
    )
    await vi.waitFor(() => {
      expect(success).toHaveBeenCalledExactlyOnceWith(ok)
    })

    const { url, init } = helpers.apiRequest(fetchMock)
    expect(url.pathname).toBe('/Statement/121/STMT-001')
    expect(JSON.parse(init.body as string)).toEqual({ memo: '메모', emailSubject: '제목' })
    expect(init.headers).toMatchObject({ 'X-HTTP-Method-Override': 'ISSUE' })
    expect(init.headers).not.toHaveProperty('x-pb-userid')
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('callback registIssue preserves success with an omitted emailSubject and explicit undefined error slot', async () => {
    const input = helpers.document()
    const fetchMock = helpers.stubApiResponse(ok)
    const success = vi.fn<(response: Spec.StatementRegistIssueApiResponse) => void>()
    const defaultErrorHandler = vi.fn<(error: unknown) => void>()
    createStatementService(helpers.config(defaultErrorHandler)).registIssue(
      helpers.CORP_NUM,
      input,
      '메모',
      helpers.USER_ID,
      undefined,
      success,
      undefined
    )
    await vi.waitFor(() => {
      expect(success).toHaveBeenCalledExactlyOnceWith(ok)
    })

    const { url, init } = helpers.apiRequest(fetchMock)
    expect(url.pathname).toBe('/Statement')
    expect(JSON.parse(init.body as string)).toEqual({ ...input, memo: '메모' })
    expect(init.headers).toMatchObject({ 'X-HTTP-Method-Override': 'ISSUE', 'x-pb-userid': helpers.USER_ID })
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('promise issue keeps userId in its full slot when emailSubject is omitted', async () => {
    const fetchMock = helpers.stubApiResponse(ok)
    await createStatementPromiseService(helpers.config()).issue(helpers.CORP_NUM, 121, 'STMT-001', '메모', undefined, helpers.USER_ID)
    const { init } = helpers.apiRequest(fetchMock)
    expect(JSON.parse(init.body as string)).toEqual({ memo: '메모' })
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe(helpers.USER_ID)
  })

  test('promise registIssue keeps later options when memo is omitted', async () => {
    const input = helpers.document()
    const fetchMock = helpers.stubApiResponse(ok)
    await createStatementPromiseService(helpers.config()).registIssue(helpers.CORP_NUM, input, undefined, helpers.USER_ID, '제목')
    const { init } = helpers.apiRequest(fetchMock)
    expect(JSON.parse(init.body as string)).toEqual({ ...input, emailSubject: '제목' })
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe(helpers.USER_ID)
  })

  test('promise FAXSend leaves the source document unchanged', async () => {
    const input = Object.freeze(helpers.document())
    const expectedInput = helpers.document()
    const fetchMock = helpers.stubApiResponse({ receiptNum: 'FAX-001' })
    await expect(createStatementPromiseService(helpers.config()).FAXSend(helpers.CORP_NUM, input, '07075103710', '0212345678')).resolves.toBe(
      'FAX-001'
    )
    expect(input).toEqual(expectedInput)
    expect(JSON.parse(helpers.apiRequest(fetchMock).init.body as string)).toEqual({
      ...expectedInput,
      sendNum: '07075103710',
      receiveNum: '0212345678',
    })
  })

  test.each(documentWrites)('$name preserves blank custom properties without changing its frozen input', async ({ invoke, extraBody, response }) => {
    const base = helpers.document()
    const input = {
      ...base,
      senderTEL: '',
      senderHP: undefined,
      detailList: base.detailList.map((detail) => ({ ...detail, remark: '' })),
      propertyBag: { ...base.propertyBag, customText: '', customNumber: '0', customSpace: ' ' },
    }
    const snapshot = structuredClone(input)
    Object.freeze(input.propertyBag)
    for (const detail of input.detailList) Object.freeze(detail)
    Object.freeze(input.detailList)
    Object.freeze(input)
    const fetchMock = helpers.stubApiResponse(response)

    await invoke(createStatementPromiseService(helpers.config()), input)

    const { init } = helpers.apiRequest(fetchMock)
    expect(JSON.parse(init.body as string)).toEqual({
      ...helpers.document(),
      propertyBag: { Balance: '2000', Deposit: '500', CBalance: '2500', customText: '', customNumber: '0', customSpace: ' ' },
      ...extraBody,
    })
    expect(input).toEqual(snapshot)
  })

  test('callback search supports the legacy short form without QString and userId', async () => {
    const response = { code: 1, message: 'Success', list: [], total: 0, pageNum: 1, perPage: 10, pageCount: 0 }
    const fetchMock = helpers.stubApiResponse(response)
    await new Promise<unknown>((resolve, reject) => {
      createStatementService(helpers.config()).search(helpers.CORP_NUM, 'W', '20261101', '20261102', ['200'], [121, 126], 'D', 1, 10, resolve, reject)
    })

    const { url, init } = helpers.apiRequest(fetchMock)
    expect(Object.fromEntries(url.searchParams)).toEqual({
      DType: 'W',
      SDate: '20261101',
      EDate: '20261102',
      State: '200',
      ItemCode: '121,126',
      Order: 'D',
      Page: '1',
      PerPage: '10',
    })
    expect(init.headers).not.toHaveProperty('x-pb-userid')
  })

  test.each([null, undefined])('checkMgtKeyInUse returns false for absent itemKey (%s)', async (itemKey) => {
    helpers.stubApiResponse({ itemKey })
    await expect(createStatementPromiseService(helpers.config()).checkMgtKeyInUse(helpers.CORP_NUM, 121, 'STMT-001')).resolves.toBe(false)
  })

  test.each([121, 122, 123, 124, 125, 126] as const)('accepts document kind %s', async (itemCode) => {
    const fetchMock = helpers.stubApiResponse({ itemKey: `ITEM-${itemCode}` })
    await createStatementPromiseService(helpers.config()).getInfo(helpers.CORP_NUM, itemCode, 'STMT-001')
    expect(helpers.apiRequest(fetchMock).url.pathname).toBe(`/Statement/${itemCode}/STMT-001`)
  })
})

describe('statement runtime: failures and callback isolation', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test.each([
    { name: 'missing corpNum', method: 'getInfo', args: ['', 121, 'STMT-001'] },
    { name: 'missing management key', method: 'getInfo', args: [helpers.CORP_NUM, 121, ''] },
    { name: 'empty management key list', method: 'getInfos', args: [helpers.CORP_NUM, 121, []] },
    { name: 'missing document', method: 'register', args: [helpers.CORP_NUM, undefined] },
    { name: 'missing file ID', method: 'deleteFile', args: [helpers.CORP_NUM, 121, 'STMT-001', ''] },
    { name: 'missing receiver', method: 'sendEmail', args: [helpers.CORP_NUM, 121, 'STMT-001', ''] },
    { name: 'invalid search date', method: 'search', args: [helpers.CORP_NUM, 'W', 'invalid', '20261102', [], [], '', 'D', 1, 10] },
  ])('$name rejects before any request', async ({ method, args }) => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    await expect(helpers.invoke(createStatementPromiseService(helpers.config()), method, args)).rejects.toMatchObject({ code: -99999999 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test.each([
    { name: 'getInfo without userId', method: 'getInfo', args: [121, 'STMT-001'] },
    { name: 'getInfo with userId', method: 'getInfo', args: [121, 'STMT-001', helpers.USER_ID] },
    { name: 'issue with memo and userId', method: 'issue', args: [121, 'STMT-001', '메모', helpers.USER_ID] },
    { name: 'registIssue full form', method: 'registIssue', args: [helpers.document(), '메모', helpers.USER_ID, '제목'] },
    { name: 'search full form', method: 'search', args: ['W', '20261101', '20261102', ['200'], [121], '검색어', 'D', 1, 10, helpers.USER_ID] },
  ])('$name sends API failures only to an explicit error-only callback', async ({ method, args }) => {
    const defaultErrorHandler = vi.fn<(error: unknown) => void>()
    const errorCallback = vi.fn<(error: unknown) => void>()
    helpers.stubApiResponse({ code: -12345, message: 'Bad request' }, 400)
    helpers.invoke(createStatementService(helpers.config(defaultErrorHandler)), method, [helpers.CORP_NUM, ...args, undefined, errorCallback])

    await vi.waitFor(() => {
      expect(errorCallback).toHaveBeenCalledTimes(1)
    })
    expect(errorCallback).toHaveBeenCalledWith(expect.objectContaining({ code: -12345, stage: 'request_api' }))
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('error-only callback stays silent after success', async () => {
    const defaultErrorHandler = vi.fn<(error: unknown) => void>()
    const errorCallback = vi.fn<(error: unknown) => void>()
    const fetchMock = helpers.stubApiResponse({ itemKey: 'ITEM-1' })
    createStatementService(helpers.config(defaultErrorHandler)).getInfo(helpers.CORP_NUM, 121, 'STMT-001', undefined, errorCallback)

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(errorCallback).not.toHaveBeenCalled()
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('promise rejects API errors and notifies its default handler once', async () => {
    const handler = vi.fn<(error: unknown) => void>()
    helpers.stubApiResponse({ code: -12345, message: 'Bad request' }, 400)
    await expect(createStatementPromiseService(helpers.config(handler)).getInfo(helpers.CORP_NUM, 121, 'STMT-001')).rejects.toMatchObject({
      code: -12345,
      stage: 'request_api',
    })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  test('callback uses its default handler when no error callback is supplied', async () => {
    const handler = vi.fn<(error: unknown) => void>()
    const success = vi.fn<() => void>()
    helpers.stubApiResponse({ code: -12345, message: 'Bad request' }, 400)
    createStatementService(helpers.config(handler)).getInfo(helpers.CORP_NUM, 121, 'STMT-001', success)
    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledTimes(1)
    })
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ code: -12345, stage: 'request_api' }))
    expect(success).not.toHaveBeenCalled()
  })

  test('callback reports local validation errors without requesting a token', async () => {
    const handler = vi.fn<(error: unknown) => void>()
    const errorCallback = vi.fn<(error: unknown) => void>()
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    createStatementService(helpers.config(handler)).getInfo('', 121, 'STMT-001', undefined, errorCallback)
    await vi.waitFor(() => {
      expect(errorCallback).toHaveBeenCalledTimes(1)
    })
    expect(errorCallback).toHaveBeenCalledWith(expect.objectContaining({ code: -99999999 }))
    expect(handler).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  describe.each(['sync', 'async'] as const)('%s error-handler failures', (style) => {
    test('promise preserves the API rejection when its default handler fails', async () => {
      const handler = failingHandler(style)
      helpers.stubApiResponse({ code: -12345, message: 'Original API failure' }, 400)
      await expect(createStatementPromiseService(helpers.config(handler)).getInfo(helpers.CORP_NUM, 121, 'STMT-001')).rejects.toMatchObject({
        code: -12345,
        message: 'Original API failure',
        stage: 'request_api',
      })
      expect(handler).toHaveBeenCalledTimes(1)
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    test('callback observes failures from an explicit error handler', async () => {
      const handler = failingHandler(style)
      const defaultHandler = vi.fn<(error: unknown) => void>()
      helpers.stubApiResponse({ code: -12345, message: 'Original API failure' }, 400)
      createStatementService(helpers.config(defaultHandler)).getInfo(helpers.CORP_NUM, 121, 'STMT-001', undefined, handler)
      await vi.waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(1)
      })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ code: -12345, stage: 'request_api' }))
      expect(defaultHandler).not.toHaveBeenCalled()
    })

    test('callback observes failures from its default error handler', async () => {
      const handler = failingHandler(style)
      helpers.stubApiResponse({ code: -12345, message: 'Original API failure' }, 400)
      createStatementService(helpers.config(handler)).getInfo(helpers.CORP_NUM, 121, 'STMT-001')
      await vi.waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(1)
      })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ code: -12345, stage: 'request_api' }))
    })
  })

  test.each(['sync', 'async'] as const)('%s success callback errors never become request errors', async (style) => {
    const defaultErrorHandler = vi.fn<(error: unknown) => void>()
    const errorCallback = vi.fn<(error: unknown) => void>()
    const successCallback = vi.fn<() => Promise<never>>(() => {
      if (style === 'async') {
        return Promise.reject(new Error('callback failed'))
      }
      throw new Error('callback failed')
    })
    helpers.stubApiResponse(ok)
    createStatementService(helpers.config(defaultErrorHandler)).issue(helpers.CORP_NUM, 121, 'STMT-001', successCallback, errorCallback)

    await vi.waitFor(() => {
      expect(successCallback).toHaveBeenCalledTimes(1)
    })
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(errorCallback).not.toHaveBeenCalled()
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })
})
