/** Append a request URI as a path, keeping slashless input out of the URL authority. */
export function buildRequestUrl(apiBaseUrl: string, uri: string): string {
  // WHATWG URL parsing trims trailing ASCII controls and spaces before resolving dot segments.
  let end = uri.length
  while (end > 0 && uri.charCodeAt(end - 1) <= 0x20) end--
  const path = uri
    .slice(0, end)
    .split(/[?#]/, 1)[0]!
    .replace(/[\t\r\n]/g, '')
  if (/(?:^|[\\/])(?:\.|%2e){1,2}(?=[\\/]|$)/i.test(path)) {
    throw new TypeError('Request URI must not contain dot path segments.')
  }

  const separator = uri.length === 0 || /^[/?#]/.test(uri) ? '' : '/'
  return `${apiBaseUrl}${separator}${uri}`
}
