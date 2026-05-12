export interface FetchJsonOptions {
  timeoutMs: number
}

export interface HttpErrorPayload {
  status: number
  body: unknown
}

class HttpResponseError extends Error implements HttpErrorPayload {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`HTTP ${String(status)}`)
    this.name = 'HttpResponseError'
    this.status = status
    this.body = body
  }
}

export async function fetchJson<T>(requestUrl: string, requestInit: RequestInit, options: FetchJsonOptions): Promise<T> {
  const response = await fetchWithTimeout(requestUrl, requestInit, options.timeoutMs)
  const responseBodyText = await response.text()

  if (!response.ok) {
    throw createHttpErrorPayload(response.status, parseErrorResponseBody(responseBodyText))
  }

  return parseJsonResponse(responseBodyText) as T
}

export async function fetchText(requestUrl: string, requestInit: RequestInit, options: FetchJsonOptions): Promise<string> {
  const response = await fetchWithTimeout(requestUrl, requestInit, options.timeoutMs)
  const responseText = await response.text()

  if (!response.ok) {
    throw createHttpErrorPayload(response.status, responseText)
  }

  return responseText
}

async function fetchWithTimeout(requestUrl: string, requestInit: RequestInit, timeoutMs: number): Promise<Response> {
  const externalSignal = requestInit.signal
  const abortController = new AbortController()
  const abortFromExternalSignal = () => {
    abortController.abort(externalSignal?.reason)
  }

  if (externalSignal?.aborted) {
    abortFromExternalSignal()
  } else {
    externalSignal?.addEventListener('abort', abortFromExternalSignal, { once: true })
  }

  const timer = setTimeout(() => {
    abortController.abort()
  }, timeoutMs)

  try {
    return await fetch(requestUrl, {
      ...requestInit,
      signal: abortController.signal,
    })
  } finally {
    clearTimeout(timer)
    externalSignal?.removeEventListener('abort', abortFromExternalSignal)
  }
}

function parseJsonResponse(responseText: string): unknown {
  if (responseText.length === 0) {
    return {}
  }

  return JSON.parse(responseText) as unknown
}

function parseErrorResponseBody(responseText: string): unknown {
  if (responseText.length === 0) {
    return {}
  }

  try {
    return JSON.parse(responseText) as unknown
  } catch {
    return responseText
  }
}

function createHttpErrorPayload(status: number, body: unknown): HttpResponseError {
  return new HttpResponseError(status, body)
}
