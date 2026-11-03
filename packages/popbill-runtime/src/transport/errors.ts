import { normalizeErrorMessage } from '@connextable/popbill-utils'

export interface RequestAbortInfo {
  source: 'signal' | 'request_timeout'
  reason: unknown
}

export class RequestAbortError extends Error {
  readonly abort: RequestAbortInfo

  constructor(abort: RequestAbortInfo) {
    super(abort.source === 'request_timeout' ? 'Popbill request timed out.' : 'Popbill request was cancelled.', { cause: abort.reason })
    this.name = 'PopbillRequestAbortError'
    this.abort = abort
  }
}

export class ResponseBodyError extends Error {
  constructor(cause: unknown) {
    super(normalizeErrorMessage(cause), { cause })
    this.name = 'PopbillResponseBodyError'
  }
}

/** A fetch rejection is distinct from an HTTP response, regardless of its shape. */
export class FetchRequestError extends Error {
  constructor(cause: unknown) {
    super(normalizeErrorMessage(cause), { cause })
    this.name = 'PopbillFetchRequestError'
  }
}

// Structural guards also recognize errors crossing independently bundled runtimes.
export function isRequestAbortError(error: unknown): error is RequestAbortError {
  if (!(error instanceof Error) || error.name !== 'PopbillRequestAbortError' || !('abort' in error)) return false
  const abort = error.abort
  return (
    typeof abort === 'object' &&
    abort !== null &&
    'source' in abort &&
    'reason' in abort &&
    (abort.source === 'signal' || abort.source === 'request_timeout')
  )
}

export function isResponseBodyError(error: unknown): error is ResponseBodyError {
  return error instanceof Error && error.name === 'PopbillResponseBodyError' && 'cause' in error
}

export function isFetchRequestError(error: unknown): error is FetchRequestError {
  return error instanceof Error && error.name === 'PopbillFetchRequestError' && 'cause' in error
}

export function throwIfRequestAborted(signal: AbortSignal | null | undefined): void {
  if (signal?.aborted) throw new RequestAbortError({ source: 'signal', reason: signal.reason })
}

/** Detaches synchronously on cancellation, so a last waiter stops shared work immediately. */
export function waitForRequest<T>(promise: Promise<T>, signal?: AbortSignal, onSettled?: () => void): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false
    const finish = (handler: () => void) => {
      if (settled) return
      settled = true
      signal?.removeEventListener('abort', abort)
      onSettled?.()
      handler()
    }
    const abort = () => finish(() => reject(new RequestAbortError({ source: 'signal', reason: signal?.reason })))
    promise.then(
      (value) => finish(() => resolve(value)),
      (error: unknown) => finish(() => reject(error))
    )
    if (signal?.aborted) abort()
    else signal?.addEventListener('abort', abort, { once: true })
  })
}
