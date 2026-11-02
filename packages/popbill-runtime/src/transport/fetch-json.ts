export interface FetchJsonOptions {
  timeoutMs: number
}

const MAX_TIMEOUT_MS = 2_147_483_647

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
  const { response, body: responseText } = await fetchWithTimeout(requestUrl, requestInit, options.timeoutMs, (value) => value.text())

  if (!response.ok) {
    throw createHttpErrorPayload(response.status, parseErrorResponseBody(responseText))
  }

  return parseJsonResponse(responseText) as T
}

export async function fetchText(requestUrl: string, requestInit: RequestInit, options: FetchJsonOptions): Promise<string> {
  const { response, body: responseText } = await fetchWithTimeout(requestUrl, requestInit, options.timeoutMs, (value) => value.text())

  if (!response.ok) {
    throw createHttpErrorPayload(response.status, responseText)
  }

  return responseText
}

/** Reads bytes without text decoding, retaining JSON API errors and the body-read timeout. */
export async function fetchBinary(requestUrl: string, requestInit: RequestInit, options: FetchJsonOptions): Promise<Uint8Array> {
  const { response, body } = await fetchWithTimeout(requestUrl, requestInit, options.timeoutMs, (value) => value.arrayBuffer())
  const bytes = new Uint8Array(body)
  if (!response.ok || response.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    throw createHttpErrorPayload(response.status, parseErrorResponseBody(new TextDecoder().decode(bytes)))
  }
  return bytes
}

async function fetchWithTimeout<T>(
  requestUrl: string,
  requestInit: RequestInit,
  timeoutMs: number,
  readBody: (response: Response) => Promise<T>
): Promise<{ response: Response; body: T }> {
  if (timeoutMs > MAX_TIMEOUT_MS) {
    throw new RangeError(`timeoutMs must not exceed ${String(MAX_TIMEOUT_MS)} milliseconds.`)
  }

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
    const response = await fetch(requestUrl, {
      ...requestInit,
      signal: abortController.signal,
    })
    const body = await readBody(response)
    return { response, body }
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
