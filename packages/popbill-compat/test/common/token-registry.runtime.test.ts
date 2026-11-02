import { afterEach, expect, it, vi } from 'vitest'
import { LinkhubAuthScope, type TokenProvider } from '@connextable/popbill-runtime'
import { createCompatRequestClient, registerCompatTokenProvider } from '@/internal/request-client'
import type { CompatConfig } from '@/config'

afterEach(() => vi.unstubAllGlobals())

it('registers provider objects weakly and removes dead references without depending on GC timing', () => {
  const references: ControlledWeakRef<object>[] = []
  class ControlledWeakRef<T extends object> {
    target: T | undefined
    reads = 0
    constructor(target: T) {
      this.target = target
      references.push(this)
    }
    deref(): T | undefined {
      this.reads += 1
      return this.target
    }
  }
  vi.stubGlobal('WeakRef', ControlledWeakRef)
  const config: CompatConfig = { LinkID: 'LINK', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
  const discarded: TokenProvider = { getToken: vi.fn<TokenProvider['getToken']>(), invalidate: vi.fn<(corpNum: string) => void>() }
  const invalidateLive = vi.fn<(corpNum: string) => void>()
  const live: TokenProvider = { getToken: vi.fn<TokenProvider['getToken']>(), invalidate: invalidateLive }
  registerCompatTokenProvider(config, discarded)
  const discardedReference = references[0]!
  expect(discardedReference.target).toBe(discarded)
  discardedReference.target = undefined
  registerCompatTokenProvider(config, live)
  expect(discardedReference.reads).toBe(1)
  const client = createCompatRequestClient(config, [LinkhubAuthScope.Member])
  expect(discardedReference.reads).toBe(1)

  const discardedDuringInvalidation: TokenProvider = { getToken: vi.fn<TokenProvider['getToken']>() }
  registerCompatTokenProvider(config, discardedDuringInvalidation)
  const invalidatedReference = references.at(-1)!
  invalidatedReference.target = undefined
  client.invalidateToken?.('1234567890')
  expect(invalidatedReference.reads).toBe(1)
  client.invalidateToken?.('1234567890')
  expect(invalidatedReference.reads).toBe(1)
  expect(invalidateLive).toHaveBeenNthCalledWith(1, '1234567890')
  expect(invalidateLive).toHaveBeenNthCalledWith(2, '1234567890')
})
