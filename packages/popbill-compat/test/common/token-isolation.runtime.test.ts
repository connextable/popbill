import { afterEach, expect, it, vi } from 'vitest'
import { createStatementPromiseService } from '@/factory'
import type { CompatConfig } from '@/config'

afterEach(() => vi.unstubAllGlobals())
it.each([1, '1'])('withdrawal invalidates the published service domain and point tokens while preserving other clients (code: %j)', async (code) => {
  let sequence = 0
  const documentTokens: Array<string | null> = []
  const pointTokens: Array<string | null> = []
  const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (target, init) => {
    const url = new URL(target instanceof Request ? target.url : target.toString())
    let response: unknown
    if (url.pathname.endsWith('/Token'))
      response = { session_token: `token-${++sequence}`, expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }
    else if (url.pathname.endsWith('/Point')) {
      pointTokens.push(new Headers(init?.headers).get('Authorization'))
      response = { remainPoint: '100' }
    } else if (url.pathname.endsWith('/QuitRequest')) response = { code, message: '완료' }
    else if (url.pathname === '/Statement/121/KEY') {
      documentTokens.push(new Headers(init?.headers).get('Authorization'))
      response = { stateCode: 100 }
    } else throw new Error(`Unexpected request ${url.pathname}`)
    return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } })
  })
  vi.stubGlobal('fetch', fetchMock)
  const config: CompatConfig = { LinkID: 'LINK', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
  const first = createStatementPromiseService(config)
  const second = createStatementPromiseService({ ...config })
  const corp = '1234567890'
  await first.getInfo(corp, 121, 'KEY')
  await first.getBalance(corp)
  await second.getInfo(corp, 121, 'KEY')
  await second.getBalance(corp)
  await first.quitMember(corp, '사용 종료')
  await first.getInfo(corp, 121, 'KEY')
  await first.getBalance(corp)
  await second.getInfo(corp, 121, 'KEY')
  await second.getBalance(corp)
  expect(sequence).toBe(7)
  expect(documentTokens).toEqual(['Bearer token-1', 'Bearer token-3', 'Bearer token-6', 'Bearer token-3'])
  expect(pointTokens).toEqual(['Bearer token-2', 'Bearer token-4', 'Bearer token-7', 'Bearer token-4'])
})
