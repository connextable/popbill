import { NotImplementedError } from '../errors'

export type CallbackService = Record<string, (...args: unknown[]) => unknown>

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
  return new Proxy({} as CallbackService, {
    get(_target, property) {
      if (typeof property !== 'string') {
        return undefined
      }

      return (...args: unknown[]) => {
        const error = new NotImplementedError(`${serviceName}.${property}`)
        const errorCallback = resolveErrorCallback(args)

        if (errorCallback) {
          errorCallback(error)
          return undefined
        }

        throw error
      }
    },
  })
}
