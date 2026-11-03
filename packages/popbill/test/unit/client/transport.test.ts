import { once } from 'node:events'
import { createServer, type Server, type ServerResponse } from 'node:http'
import { createPopbillClient } from '@/client'
import type { PopbillApiError } from '@/errors'

const nativeFetch = globalThis.fetch
const business = { businessNumber: '1234567890' }
const config = { linkId: 'LINK', secretKey: Buffer.from('secret').toString('base64'), userId: 'operator', isTest: true }

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

function urlOf(target: Parameters<typeof fetch>[0]): URL {
  return new URL(target instanceof Request ? target.url : target.toString())
}

function tokenResponse(sessionToken = 'session') {
  return Response.json({
    session_token: sessionToken,
    expiration: '2099-01-01T00:00:00Z',
    serviceID: 'POPBILL_TEST',
    userID: business.businessNumber,
  })
}

function companyResponse(name = 'company') {
  return Response.json({ corpName: name, ceoname: 'CEO', addr: 'address', bizType: 'service', bizClass: 'software' })
}

function delayedAuthentication() {
  const started = deferred<void>()
  const firstToken = deferred<Response>()
  let authSignal: AbortSignal | null | undefined
  let tokenCount = 0
  const businessTokens: (string | null)[] = []
  const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(async (target, init) => {
    if (urlOf(target).pathname.endsWith('/Token')) {
      tokenCount += 1
      if (tokenCount === 1) {
        authSignal = init?.signal
        started.resolve()
        // A late result must not repopulate a cancelled or invalidated cache.
        return await firstToken.promise
      }
      return tokenResponse('fresh-session')
    }
    businessTokens.push(new Headers(init?.headers).get('Authorization'))
    return companyResponse()
  })
  return { fetch, started, firstToken, businessTokens, getAuthSignal: () => authSignal, getTokenCount: () => tokenCount }
}

afterEach(() => vi.unstubAllGlobals())

describe('client transport and call options', () => {
  test('injects authentication, server time, point and business requests and isolates clients', async () => {
    const globalFetch = vi.fn<typeof fetch>().mockRejectedValue(new Error('unexpected global fetch'))
    vi.stubGlobal('fetch', globalFetch)
    const paths: string[] = []
    const customFetch = vi.fn<typeof fetch>().mockImplementation(async (target) => {
      const path = urlOf(target).pathname
      paths.push(path)
      if (path === '/Time') return new Response('2026-11-03T00:00:00Z')
      if (path.endsWith('/Token')) return tokenResponse()
      if (path.endsWith('/Point')) return Response.json({ remainPoint: '100.5' })
      return companyResponse('first')
    })
    const first = createPopbillClient({ ...config, useLocalTime: false, fetch: customFetch })
    const secondFetch = vi
      .fn<typeof fetch>()
      .mockImplementation(async (target) => (urlOf(target).pathname.endsWith('/Token') ? tokenResponse('second') : companyResponse('second')))
    const second = createPopbillClient({ ...config, fetch: secondFetch })
    await expect(first.services.common.getCompanyInfo(business)).resolves.toMatchObject({ companyName: 'first' })
    await expect(first.services.common.getMemberPointBalance(business)).resolves.toEqual({ remainingPoints: '100.5' })
    await expect(second.services.common.getCompanyInfo(business)).resolves.toMatchObject({ companyName: 'second' })
    expect(paths).toEqual(['/Time', '/POPBILL_TEST/Token', '/CorpInfo', '/Time', '/POPBILL_TEST/Token', '/POPBILL_TEST/Point'])
    expect(secondFetch).toHaveBeenCalledTimes(2)
    expect(globalFetch).not.toHaveBeenCalled()
  })

  test('rejects a pre-cancelled call without HTTP and preserves an arbitrary reason through onError', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>()
    const onError = vi.fn<(error: PopbillApiError) => void>()
    const client = createPopbillClient({ ...config, fetch, onError })
    const reason = { code: -11000000, message: 'caller cancelled' }
    const error: unknown = await client.services.common
      .getCompanyInfo(business, { signal: AbortSignal.abort(reason) })
      .catch((failure: unknown) => failure)
    expect(error).toMatchObject({ type: 'unknown', stage: 'unknown', retriable: false, abort: { source: 'signal', reason } })
    expect((error as PopbillApiError).abort?.reason).toBe(reason)
    expect((error as PopbillApiError).raw).toBe(reason)
    expect(fetch).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledExactlyOnceWith(error)
  })

  test.each([Object.create(null) as unknown, Symbol('cancelled'), null, 42])('retains non-Error cancellation reasons', async (reason) => {
    const fetch = vi.fn<typeof globalThis.fetch>()
    const onError = vi.fn<(error: PopbillApiError) => void>()
    const client = createPopbillClient({ ...config, fetch, onError })
    const error = await client.services.common
      .getCompanyInfo(business, { signal: AbortSignal.abort(reason) })
      .catch((failure: unknown) => failure as PopbillApiError)
    expect(error).toMatchObject({ type: 'unknown', stage: 'unknown', retriable: false })
    expect((error as PopbillApiError).raw).toBe(reason)
    expect((error as PopbillApiError).abort?.reason).toBe(reason)
    expect(fetch).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledExactlyOnceWith(error)
  })

  test.each([
    { method: 'getCompanyInfo', response: null },
    { method: 'listContacts', response: {} },
  ] as const)('does not label invalid $method responses as caller input errors', async ({ method, response }) => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockImplementation(async (target) => (urlOf(target).pathname.endsWith('/Token') ? tokenResponse() : Response.json(response)))
    const client = createPopbillClient({ ...config, fetch })
    const error: unknown = await client.services.common[method](business).catch((failure: unknown) => failure)
    expect(error).toMatchObject({ type: 'unknown', stage: 'unknown', retriable: false, raw: expect.any(TypeError) })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  test('retains actual input validation without starting HTTP', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>()
    const client = createPopbillClient({ ...config, fetch })
    await expect(client.services.common.getCompanyInfo({ businessNumber: '' })).rejects.toMatchObject({
      type: 'input_validation',
      stage: 'validate_input',
    })
    expect(fetch).not.toHaveBeenCalled()
  })

  test.each([
    { label: 'policy code', reason: { code: 403, message: 'egress blocked' } },
    { label: 'catalog code', reason: { code: -11000000, message: 'egress blocked' } },
    {
      label: 'HTTP and stage shape',
      reason: { status: 503, body: { code: -11000000, message: 'fake response' }, requestStage: 'issue_token', cause: 'local failure' },
    },
    { label: 'local TypeError', reason: new TypeError('transport.fetch is not a function') },
    { label: 'non-stringifiable object', reason: Object.create(null) as unknown },
  ])('preserves the transport origin of $label failures', async ({ reason }) => {
    for (const stage of ['issue_token', 'request_api'] as const) {
      const onError = vi.fn<(error: PopbillApiError) => void>()
      const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(async (target) => {
        if (stage === 'request_api' && urlOf(target).pathname.endsWith('/Token')) return tokenResponse()
        throw reason
      })
      const client = createPopbillClient({ ...config, fetch, onError })
      const error = await client.services.common.getCompanyInfo(business).catch((failure: unknown) => failure as PopbillApiError)
      expect(error).toMatchObject({ code: -99999999, type: 'unknown', stage, knownCode: false, retriable: false })
      expect((error as PopbillApiError).raw).toBe(reason)
      expect((error as PopbillApiError).status).toBeUndefined()
      expect(onError).toHaveBeenCalledExactlyOnceWith(error)
      expect(fetch).toHaveBeenCalledTimes(stage === 'issue_token' ? 1 : 2)
    }
  })

  test('retains actual HTTP API errors and their body', async () => {
    const body = { code: -11000000, message: 'remote error' }
    const client = createPopbillClient({
      ...config,
      fetch: async (target) => (urlOf(target).pathname.endsWith('/Token') ? tokenResponse() : Response.json(body, { status: 400 })),
    })
    await expect(client.services.common.getCompanyInfo(business)).rejects.toMatchObject({
      code: body.code,
      type: 'api_response',
      stage: 'request_api',
      knownCode: true,
      status: 400,
      raw: body,
    })
  })

  test('cancels one token waiter while an unsignalled call and its cache continue', async () => {
    const transport = delayedAuthentication()
    const client = createPopbillClient({ ...config, fetch: transport.fetch })
    const controller = new AbortController()
    const first = client.services.common.getCompanyInfo(business, { signal: controller.signal }).catch((error: unknown) => error)
    const second = client.services.common.getCompanyInfo(business)
    await transport.started.promise
    const reason = new Error('cancel first caller')
    controller.abort(reason)
    expect(await first).toMatchObject({ stage: 'issue_token', abort: { source: 'signal', reason } })
    expect(transport.getAuthSignal()?.aborted).toBe(false)
    expect(transport.businessTokens).toEqual([])
    transport.firstToken.resolve(tokenResponse())
    await second
    await client.services.common.getCompanyInfo(business)
    expect(transport.getTokenCount()).toBe(1)
    expect(transport.businessTokens).toEqual(['Bearer session', 'Bearer session'])
  })

  test('aborts the last token waiter and rejects late cache writes after a fresh call', async () => {
    const transport = delayedAuthentication()
    const client = createPopbillClient({ ...config, fetch: transport.fetch })
    const controller = new AbortController()
    const first = client.services.common.getCompanyInfo(business, { signal: controller.signal }).catch((error: unknown) => error)
    await transport.started.promise
    controller.abort()
    expect(await first).toMatchObject({ abort: { source: 'signal' } })
    expect(transport.getAuthSignal()?.aborted).toBe(true)
    await client.services.common.getCompanyInfo(business)
    transport.firstToken.resolve(tokenResponse('stale-session'))
    await new Promise<void>((resolve) => setImmediate(resolve))
    await client.services.common.getCompanyInfo(business)
    expect(transport.getTokenCount()).toBe(2)
    expect(transport.businessTokens).toEqual(['Bearer fresh-session', 'Bearer fresh-session'])
  })

  test('does not start a business request when cancelled while awaiting a cached token', async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockImplementation(async (target) => (urlOf(target).pathname.endsWith('/Token') ? tokenResponse() : companyResponse()))
    const client = createPopbillClient({ ...config, fetch })
    await client.services.common.getCompanyInfo(business)
    const controller = new AbortController()
    const next = client.services.common.getCompanyInfo(business, { signal: controller.signal }).catch((error: unknown) => error)
    controller.abort()
    expect(await next).toMatchObject({ abort: { source: 'signal' } })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  test('keeps the call-time signal when the caller later changes the options object', async () => {
    const transport = delayedAuthentication()
    const client = createPopbillClient({ ...config, fetch: transport.fetch })
    const controller = new AbortController()
    const options = { signal: controller.signal }
    const result = client.services.common.getCompanyInfo(business, options).catch((error: unknown) => error)
    await transport.started.promise
    options.signal = new AbortController().signal
    controller.abort()
    expect(await result).toMatchObject({ abort: { source: 'signal' } })
    expect(transport.getAuthSignal()?.aborted).toBe(true)
    transport.firstToken.resolve(tokenResponse())
    await new Promise<void>((resolve) => setImmediate(resolve))
  })

  test('isolates cancellation between simultaneous business requests on one client', async () => {
    const bothStarted = deferred<void>()
    const secondResponse = deferred<Response>()
    let requests = 0
    let secondSignal: AbortSignal | null | undefined
    const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(async (target, init) => {
      if (urlOf(target).pathname.endsWith('/Token')) return tokenResponse()
      requests += 1
      if (requests === 1)
        return await new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true })
        })
      secondSignal = init?.signal
      bothStarted.resolve()
      return await secondResponse.promise
    })
    const client = createPopbillClient({ ...config, fetch })
    const controller = new AbortController()
    const first = client.services.common.getCompanyInfo(business, { signal: controller.signal }).catch((error: unknown) => error)
    const second = client.services.common.getCompanyInfo(business)
    await bothStarted.promise
    controller.abort()
    expect(await first).toMatchObject({ stage: 'request_api', abort: { source: 'signal' } })
    expect(secondSignal?.aborted).toBe(false)
    secondResponse.resolve(companyResponse('second'))
    await expect(second).resolves.toMatchObject({ companyName: 'second' })
  })

  test('classifies authentication timeouts and never starts a business request', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(
      async (_target, init) =>
        await new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true })
        })
    )
    const client = createPopbillClient({ ...config, fetch, requestTimeoutMs: 25 })
    await expect(client.services.common.getCompanyInfo(business)).rejects.toMatchObject({
      type: 'timeout',
      retriable: false,
      stage: 'issue_token',
      abort: { source: 'request_timeout' },
    })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  test('does not swallow cancellation of server time lookup or start token issuance', async () => {
    const started = deferred<void>()
    const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(async (_target, init) => {
      started.resolve()
      return await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true })
      })
    })
    const client = createPopbillClient({ ...config, useLocalTime: false, fetch })
    const controller = new AbortController()
    const result = client.services.common.getCompanyInfo(business, { signal: controller.signal }).catch((error: unknown) => error)
    await started.promise
    controller.abort()
    expect(await result).toMatchObject({ stage: 'issue_token', abort: { source: 'signal' } })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(urlOf(fetch.mock.calls[0]![0]).pathname).toBe('/Time')
  })
})

describe('native response body failures through the public client', () => {
  let server: Server
  let response: ServerResponse | undefined
  let baseUrl: string
  let headers: ReturnType<typeof deferred<void>>

  beforeEach(async () => {
    headers = deferred<void>()
    server = createServer((request, incomingResponse) => {
      if (request.url?.endsWith('/Token')) {
        incomingResponse.setHeader('Content-Type', 'application/json')
        incomingResponse.end(JSON.stringify({ session_token: 'session', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
        return
      }
      response = incomingResponse
      incomingResponse.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': '100' })
      incomingResponse.write('{"ok":')
    })
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Expected loopback server address')
    baseUrl = `http://127.0.0.1:${address.port}`
  })

  afterEach(async () => {
    const closed = once(server, 'close')
    server.closeAllConnections()
    server.close()
    await closed
  })

  function invoke(kind: 'json' | 'binary', signal?: AbortSignal, timeoutMs = 2000) {
    const client = createPopbillClient({
      ...config,
      requestTimeoutMs: timeoutMs,
      fetch: async (target, init) => {
        const url = urlOf(target)
        const result = await nativeFetch(new URL(url.pathname + url.search, baseUrl), init)
        if (!url.pathname.endsWith('/Token')) headers.resolve()
        return result
      },
    })
    const promise =
      kind === 'json'
        ? client.services.common.getCompanyInfo(business, { signal })
        : client.services.taxInvoice.downloadInvoicePDF({ ...business, invoiceDocumentKeyType: 'SELL', invoiceManagementKey: 'KEY' }, { signal })
    return promise.catch((error: unknown) => error as PopbillApiError)
  }

  test.each(['json', 'binary'] as const)('preserves caller cancellation during %s body reads', async (kind) => {
    const controller = new AbortController()
    const result = invoke(kind, controller.signal)
    await headers.promise
    const reason = { message: 'stop reading', code: 20 }
    controller.abort(reason)
    const error = (await result) as PopbillApiError
    expect(error).toMatchObject({ retriable: false, stage: 'request_api', abort: { source: 'signal' } })
    expect(error.abort?.reason).toBe(reason)
    expect(error.raw).toBe(reason)
  })

  test.each(['json', 'binary'] as const)('classifies %s body timeouts without losing the cause', async (kind) => {
    const controller = new AbortController()
    const error = (await invoke(kind, controller.signal, 250)) as PopbillApiError
    expect(error).toMatchObject({ type: 'timeout', code: -99999997, retriable: false, stage: 'request_api', abort: { source: 'request_timeout' } })
    expect(error.raw).toBeInstanceOf(DOMException)
    expect(error.abort?.reason).toBe(error.raw)
    controller.abort(new Error('later cancellation'))
    expect(error.abort?.source).toBe('request_timeout')
  })

  test.each(['json', 'binary'] as const)('classifies %s body disconnections and retains the nested socket error', async (kind) => {
    const result = invoke(kind)
    await headers.promise
    response!.destroy()
    const error = (await result) as PopbillApiError
    expect(error).toMatchObject({ type: 'network', code: -99999998, retriable: false, stage: 'request_api' })
    expect(error.raw).toMatchObject({ name: 'TypeError', cause: { code: 'UND_ERR_SOCKET' } })
  })
})
