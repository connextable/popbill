import { AsyncLocalStorage } from 'node:async_hooks'

export interface RequestCallOptions {
  signal?: AbortSignal
}

/** Passed as an object across package boundaries, including bundled runtimes. */
export interface RequestContext {
  getSignal(): AbortSignal | undefined
  run<T>(options: RequestCallOptions, handler: () => T): T
}

// One storage instance avoids a lifecycle/dispose requirement for every client.
const storage = new AsyncLocalStorage<RequestCallOptions & { owner: symbol }>()

export function createRequestContext(): RequestContext {
  const owner = Symbol('popbill-client')
  return {
    getSignal: () => {
      const current = storage.getStore()
      return current?.owner === owner ? current.signal : undefined
    },
    run: (options, handler) => storage.run({ owner, signal: options.signal }, handler),
  }
}
