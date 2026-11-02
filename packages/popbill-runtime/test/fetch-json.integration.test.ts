import { once } from 'node:events'
import { createServer, type Server } from 'node:http'
import { fetchJson, fetchText } from '@/transport/fetch-json'

describe('response body cancellation', () => {
  let server: Server
  let requestUrl: string

  beforeEach(async () => {
    server = createServer((_request, response) => {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.write('{"ok":')
    })

    server.listen(0, '127.0.0.1')
    await once(server, 'listening')

    const address = server.address()
    if (!address || typeof address === 'string') {
      throw new Error('Expected a local HTTP server address')
    }
    requestUrl = `http://127.0.0.1:${String(address.port)}`
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    const closed = once(server, 'close')
    server.closeAllConnections()
    server.close()
    await closed
  })

  test.each([
    { name: 'JSON', fetchResponse: fetchJson },
    { name: 'text', fetchResponse: fetchText },
  ])(
    'times out while reading a stalled $name response body',
    async ({ fetchResponse }) => {
      const originalFetch = globalThis.fetch
      let headersReceived = false
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (...args) => {
        const response = await originalFetch(...args)
        headersReceived = true
        return response
      })

      await expect(fetchResponse(requestUrl, { method: 'GET' }, { timeoutMs: 200 })).rejects.toMatchObject({
        name: 'AbortError',
      })
      expect(headersReceived).toBe(true)
    },
    1_000
  )

  test('honors external cancellation after response headers arrive', async () => {
    const originalFetch = globalThis.fetch
    let notifyHeadersReceived: (() => void) | undefined
    const headersReceived = new Promise<void>((resolve) => {
      notifyHeadersReceived = resolve
    })
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (...args) => {
      const response = await originalFetch(...args)
      notifyHeadersReceived?.()
      return response
    })

    const abortController = new AbortController()
    const responsePromise = fetchJson(requestUrl, { signal: abortController.signal }, { timeoutMs: 5_000 })
    const responseOutcome = responsePromise.then(
      (value) => ({ value }),
      (error: unknown) => ({ error })
    )
    await headersReceived
    await new Promise<void>((resolve) => setImmediate(resolve))
    abortController.abort()

    await expect(responseOutcome).resolves.toMatchObject({ error: { name: 'AbortError' } })
  }, 1_000)
})
