import { invokeUserCallback } from '@/index'

describe('invokeUserCallback', () => {
  test('delivers the original value once and ignores an absent callback', () => {
    const value = { code: 1 }
    let receiver: unknown = 'not called'
    const callback = vi.fn(function (this: unknown) {
      receiver = this
    })
    expect(invokeUserCallback(undefined, value)).toBeUndefined()
    expect(invokeUserCallback(callback, value)).toBeUndefined()
    expect(callback).toHaveBeenCalledExactlyOnceWith(value)
    expect(receiver).toBeUndefined()
  })

  test('isolates synchronous callback failures', () => {
    expect(() =>
      invokeUserCallback(() => {
        throw new Error('user hook failed')
      }, 'original value')
    ).not.toThrow()
  })

  test('observes rejected promises without waiting for the user hook', async () => {
    const failure = Promise.reject(new Error('user hook rejected'))
    expect(invokeUserCallback(() => failure, 'original value')).toBeUndefined()
    await new Promise<void>((resolve) => setImmediate(resolve))
  })

  test('assimilates rejecting thenables and throwing then accessors', async () => {
    const then = vi.fn((_resolve: unknown, reject: (error: Error) => void) => reject(new Error('user thenable rejected')))
    invokeUserCallback(() => ({ then }), undefined)
    invokeUserCallback(
      () => ({
        get then(): never {
          throw new Error('then accessor failed')
        },
      }),
      undefined
    )
    await Promise.resolve()
    await Promise.resolve()
    expect(then).toHaveBeenCalledOnce()
  })
})
