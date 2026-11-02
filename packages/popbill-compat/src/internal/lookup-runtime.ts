import type { PopbillRequestClient } from '@connextable/popbill-runtime'
import type { CompatConfig } from '@/config'
import { asThrowableCompatError, createLegacyValidationError, toCompatRuntimeError, type CompatRuntimeError } from './errors'
import { validateCorpNum } from './validation'
import { invokeUserCallback } from './callback'
import { parseCallbackArguments } from './callback-arguments'

export interface LookupRuntimeContext {
  requestClient: PopbillRequestClient
  defaultErrorHandler?: (error: CompatRuntimeError) => void
}

export type LookupRequestMethod = (...args: never[]) => Promise<unknown>

/** Applies the same callback/Promise error contract to the three query services. */
export function createLookupRuntimeMethods<TCallback, TPromise>(
  config: CompatConfig,
  serviceName: string,
  requests: Record<string, LookupRequestMethod>
): { callback: TCallback; promise: TPromise } {
  return {
    callback: Object.fromEntries(
      Object.entries(requests).map(([method, handler]) => [
        method,
        (...args: unknown[]) => {
          const parsed = parseCallbackArguments(args)
          void Promise.resolve()
            .then(() => handler(...(parsed.requestArgs as never[])))
            .then(
              (response) => invokeUserCallback(parsed.success, response),
              (error: unknown) =>
                invokeUserCallback(parsed.error ?? config.defaultErrorHandler, toCompatRuntimeError(error, `${serviceName}.${method}`))
            )
        },
      ])
    ) as TCallback,
    promise: Object.fromEntries(
      Object.entries(requests).map(([method, handler]) => [
        method,
        async (...args: unknown[]) => {
          try {
            return await handler(...(args as never[]))
          } catch (error) {
            const throwable = asThrowableCompatError(toCompatRuntimeError(error, `${serviceName}.${method}`))
            invokeUserCallback(config.defaultErrorHandler, throwable)
            throw throwable
          }
        },
      ])
    ) as TPromise,
  }
}

export async function requestLookup<T>(
  context: LookupRuntimeContext,
  corpNum: string,
  uri: string,
  userId?: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  validateLookupCorpNum(corpNum)
  return context.requestClient.requestJson<T>({ corpNum, uri, userId, method, body: body === undefined ? undefined : JSON.stringify(body) })
}

export function validateLookupCorpNum(corpNum: string): void {
  const error = validateCorpNum(corpNum)
  if (error) throw error
}

export function requireLookupText(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) throw createLegacyValidationError(message)
}
