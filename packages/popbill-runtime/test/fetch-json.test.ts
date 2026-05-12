import { fetchJson } from '@/transport/fetch-json'

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

    await expect(requestPromise).rejects.toBe(abortReason)
  })
})
