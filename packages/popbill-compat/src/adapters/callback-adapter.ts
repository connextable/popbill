import { NotImplementedError } from '@/errors'

export type CallbackService = Record<string, (...args: any[]) => any>

type ErrorCallback = (error: unknown) => void

function resolveErrorCallback(args: unknown[]): ErrorCallback | undefined {
  if (args.length < 2) {
    return undefined
  }

  const maybeSuccessCallback = args.at(-2)
  const candidate = args.at(-1)

  if (typeof maybeSuccessCallback === 'function' && typeof candidate === 'function') {
    return candidate as ErrorCallback
  }

  return undefined
}

export function createCallbackServiceStub(serviceName: string): CallbackService {
  return createTypedCallbackServiceStub<CallbackService>(serviceName, [])
}

function createCallbackMethod(serviceName: string, methods: string): (...args: unknown[]) => unknown {
  return (...args: unknown[]) => {
    const error = new NotImplementedError(`${serviceName}.${methods}`)
    const errorCallback = resolveErrorCallback(args)

    if (errorCallback) {
      errorCallback(error)
      return undefined
    }

    throw error
  }
}

export function createTypedCallbackServiceStub<Methods extends object>(
  serviceName: string,
  methods: readonly Extract<keyof Methods, string>[]
): Methods {
  const target: Record<string, (...args: unknown[]) => unknown> = {}

  for (const method of methods) {
    target[method] = createCallbackMethod(serviceName, method)
  }

  return new Proxy(target, {
    get(_target, property) {
      if (typeof property !== 'string') {
        return undefined
      }

      const existing = target[property]
      if (existing) {
        return existing
      }

      return createCallbackMethod(serviceName, property)
    },
  }) as Methods
}
