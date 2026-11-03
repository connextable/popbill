import { throwIfRequestAborted, type RequestCallOptions, type RequestContext } from '@connextable/popbill-runtime'
import { invokeLookupMethod } from '@/internal/lookup-service'
import type { PopbillApiError } from '@/errors'

/** 호출 전체에 적용하며 다른 호출의 취소와 격리합니다. */
export type PopbillCallOptions = RequestCallOptions

export type WithPopbillCallOptions<Service> = {
  [Method in keyof Service]: Service[Method] extends (...args: infer Args) => infer Result
    ? (...args: [...Args, options?: PopbillCallOptions]) => Result
    : Service[Method]
}

/** One facade boundary owns call context and the client's error hook. */
export function wrapClientServices<Services extends Record<string, object>>(
  services: Services,
  requestContext: RequestContext,
  onError?: (error: PopbillApiError) => void
): Services {
  return Object.fromEntries(
    Object.entries(services).map(([serviceName, service]) => [
      serviceName,
      Object.fromEntries(
        Object.entries(service).map(([method, handler]: [string, unknown]) => [
          method,
          (input: unknown, options: PopbillCallOptions = {}) =>
            invokeLookupMethod({ onError }, `${serviceName}.${method}`, () =>
              requestContext.run(options, async () => {
                const signal = requestContext.getSignal()
                throwIfRequestAborted(signal)
                const result: unknown = await Reflect.apply(handler as (...args: unknown[]) => Promise<unknown>, service, [input])
                throwIfRequestAborted(signal)
                return result
              })
            ),
        ])
      ),
    ])
  ) as Services
}
