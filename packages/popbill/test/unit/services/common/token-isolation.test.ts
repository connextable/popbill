import { afterEach, expect, it, vi } from 'vitest'
import { createPopbillClient } from '@/client'

afterEach(() => vi.unstubAllGlobals())
it('modern services share withdrawal invalidation within one client and keep other clients isolated', async () => {
  let sequence = 0
  const documentTokens: Array<string | null> = []
  const pointTokens: Array<string | null> = []
  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>().mockImplementation(async (target, init) => {
      const url = new URL(target instanceof Request ? target.url : target.toString())
      let response: unknown
      if (url.pathname.endsWith('/Token'))
        response = { session_token: `token-${++sequence}`, expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }
      else if (url.pathname.endsWith('/Point')) {
        pointTokens.push(new Headers(init?.headers).get('Authorization'))
        response = { remainPoint: '100' }
      } else if (url.pathname.endsWith('/QuitRequest')) response = { code: 1, message: '완료' }
      else if (url.pathname === '/Statement/121/KEY') {
        documentTokens.push(new Headers(init?.headers).get('Authorization'))
        response = { stateCode: 100 }
      } else throw new Error(`Unexpected request ${url.pathname}`)
      return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } })
    })
  )
  const config = { linkId: 'LINK', secretKey: Buffer.from('secret').toString('base64'), userId: 'operator', isTest: true }
  const first = createPopbillClient(config)
  const second = createPopbillClient(config)
  const business = { businessNumber: '1234567890' }
  const document = { ...business, documentTypeCode: 121 as const, managementKey: 'KEY' }
  await first.services.statement.getStatementInfo(document)
  await first.services.common.getMemberPointBalance(business)
  await second.services.statement.getStatementInfo(document)
  await second.services.common.getMemberPointBalance(business)
  await first.services.common.quitMember({ ...business, reason: '사용 종료' })
  await first.services.statement.getStatementInfo(document)
  await first.services.common.getMemberPointBalance(business)
  await second.services.statement.getStatementInfo(document)
  await second.services.common.getMemberPointBalance(business)
  expect(sequence).toBe(7)
  expect(documentTokens).toEqual(['Bearer token-1', 'Bearer token-3', 'Bearer token-6', 'Bearer token-3'])
  expect(pointTokens).toEqual(['Bearer token-2', 'Bearer token-4', 'Bearer token-7', 'Bearer token-4'])
})
