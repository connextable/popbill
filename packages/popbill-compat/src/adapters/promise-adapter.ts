import { NotImplementedError } from '../errors'

export type PromiseService = Record<string, (...args: unknown[]) => Promise<unknown>>

export function createPromiseServiceStub(serviceName: string): PromiseService {
  return createTypedPromiseServiceStub<PromiseService>(serviceName, [])
}

function createPromiseMethod(serviceName: string, methodName: string): (...args: unknown[]) => Promise<never> {
  return async (..._args: unknown[]) => {
    throw new NotImplementedError(`${serviceName}.${methodName}`)
  }
}

export function createTypedPromiseServiceStub<Methods extends object>(
  serviceName: string,
  methodNames: readonly (Extract<keyof Methods, string>)[],
): Methods {
  const target: Record<string, (...args: unknown[]) => Promise<unknown>> = {}

  for (const methodName of methodNames) {
    target[methodName] = createPromiseMethod(serviceName, methodName)
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

      return createPromiseMethod(serviceName, property)
    },
  }) as Methods
}
