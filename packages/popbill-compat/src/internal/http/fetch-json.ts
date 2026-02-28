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
  const responseBody = await parseJsonResponse(response)

  if (!response.ok) {
    throw createHttpErrorPayload(response.status, responseBody)
  }

  return responseBody as T
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
  const abortController = new AbortController()
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
  }
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const responseText = await response.text()

  if (responseText.length === 0) {
    return {}
  }

  return JSON.parse(responseText) as unknown
}

function createHttpErrorPayload(status: number, body: unknown): HttpResponseError {
  return new HttpResponseError(status, body)
}
