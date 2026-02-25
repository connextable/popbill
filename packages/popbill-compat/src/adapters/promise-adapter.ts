import { NotImplementedError } from '../errors'

export type PromiseService = Record<string, (...args: unknown[]) => Promise<never>>

export function createPromiseServiceStub(serviceName: string): PromiseService {
  return new Proxy({} as PromiseService, {
    get(_target, property) {
      if (typeof property !== 'string') {
        return undefined
      }

      return async (..._args: unknown[]) => {
        throw new NotImplementedError(`${serviceName}.${property}`)
      }
    },
  })
}
