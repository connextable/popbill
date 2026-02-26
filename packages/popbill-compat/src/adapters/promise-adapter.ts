import { NotImplementedError } from '@/errors'

export type PromiseService = Record<string, (...args: any[]) => Promise<any>>

export function createPromiseServiceStub(serviceName: string): PromiseService {
  return createTypedPromiseServiceStub<PromiseService>(serviceName, [])
}

function createPromiseMethod(serviceName: string, methods: string): (...args: unknown[]) => Promise<never> {
  return (..._args: unknown[]) => Promise.reject(new NotImplementedError(`${serviceName}.${methods}`))
}

export function createTypedPromiseServiceStub<Methods extends object>(
  serviceName: string,
  methods: readonly Extract<keyof Methods, string>[]
): Methods {
  const target: Record<string, (...args: unknown[]) => Promise<unknown>> = {}

  for (const method of methods) {
    target[method] = createPromiseMethod(serviceName, method)
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
