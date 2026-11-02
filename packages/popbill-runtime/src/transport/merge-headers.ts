export function mergeRequestHeaders(customHeaders: Record<string, string>, sdkHeaders: Record<string, string>): Record<string, string> {
  const sdkHeaderNames = new Set(Object.keys(sdkHeaders).map((name) => name.toLowerCase()))
  const remainingHeaders = Object.entries(customHeaders).filter(([name]) => !sdkHeaderNames.has(name.toLowerCase()))

  return { ...Object.fromEntries(remainingHeaders), ...sdkHeaders }
}
