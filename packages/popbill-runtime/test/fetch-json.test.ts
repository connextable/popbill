import { fetchBinary, fetchJson, fetchText } from '@/transport/fetch-json'

describe('fetchJson', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('parses JSON error payload when response body is valid JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"code":-999,"message":"failed"}', { status: 400 }))

    await expect(fetchJson('https://example.test/resource', { method: 'GET' }, { timeoutMs: 1_000 })).rejects.toMatchObject({
      status: 400,
      body: { code: -999, message: 'failed' },
    })
  })

  test('preserves status and plain text body for non-json error responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Service unavailable', { status: 503 }))

    await expect(fetchJson('https://example.test/resource', { method: 'GET' }, { timeoutMs: 1_000 })).rejects.toMatchObject({
      status: 503,
      body: 'Service unavailable',
    })
  })

  test('returns empty object for empty successful responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 200 }))

    await expect(fetchJson('https://example.test/resource', { method: 'GET' }, { timeoutMs: 1_000 })).resolves.toEqual({})
  })

  test('rejects timeout values that Node would shorten to one millisecond', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'))

    await expect(fetchJson('https://example.test/resource', {}, { timeoutMs: 2_147_483_648 })).rejects.toThrow(RangeError)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('propagates external abort signal', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_requestUrl, requestInit) => {
      const signal = requestInit?.signal

      if (!signal) {
        throw new Error('Expected a signal on fetch request')
      }

      return await new Promise<Response>((_resolve, reject) => {
        if (signal.aborted) {
          reject(signal.reason)
          return
        }

        signal.addEventListener(
          'abort',
          () => {
            reject(signal.reason)
          },
          { once: true }
        )
      })
    })

    const abortController = new AbortController()
    const abortReason = new Error('Aborted by caller')
    const requestPromise = fetchJson<unknown>(
      'https://example.test/resource',
      { method: 'GET', signal: abortController.signal },
      { timeoutMs: 60_000 }
    )

    abortController.abort(abortReason)

    const failure: unknown = await requestPromise.catch((error: unknown) => error)
    expect(failure).toMatchObject({ abort: { source: 'signal', reason: abortReason } })
    expect((failure as { cause: unknown }).cause).toBe(abortReason)
  })

  test('does not invoke an injected fetch for an already cancelled call', async () => {
    const injectedFetch = vi.fn<typeof fetch>()
    const reason = { code: -11000000, message: 'caller cancelled' }
    await expect(
      fetchJson('https://example.test/', { signal: AbortSignal.abort(reason) }, { timeoutMs: 1000, fetch: injectedFetch })
    ).rejects.toMatchObject({ abort: { source: 'signal', reason } })
    expect(injectedFetch).not.toHaveBeenCalled()
  })

  test.each([fetchJson, fetchText, fetchBinary])('retains fetch rejection origin and original cause', async (transport) => {
    const reason = { status: 403, body: { code: -11000000, message: 'policy blocked' } }
    const fetch = vi.fn<typeof globalThis.fetch>().mockRejectedValue(reason)
    const failure: unknown = await transport('https://example.test/', {}, { timeoutMs: 1000, fetch }).catch((error: unknown) => error)
    expect(failure).toMatchObject({ name: 'PopbillFetchRequestError' })
    expect((failure as Error).cause).toBe(reason)
  })
})
