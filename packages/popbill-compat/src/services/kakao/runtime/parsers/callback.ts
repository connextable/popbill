type Callback = (value: unknown) => void
export function parseCallbackArguments(args: unknown[]): { requestArgs: unknown[]; success?: Callback; error?: Callback } {
  const index = args.findIndex((value) => typeof value === 'function')
  if (index < 0) return { requestArgs: args }
  const first = args[index] as Callback,
    next = args[index + 1]
  if (index + 1 < args.length)
    return { requestArgs: args.slice(0, index), success: first, error: typeof next === 'function' ? (next as Callback) : undefined }
  if (index > 0 && args[index - 1] === undefined) return { requestArgs: args.slice(0, index - 1), error: first }
  return { requestArgs: args.slice(0, index), success: first }
}
export function normalizeCallbackArguments(method: string, args: unknown[]): unknown[] {
  const subjectOverloads: Record<string, number> = {
    sendATS_one: 12,
    sendATS_same: 11,
    sendFTS_one: 13,
    sendFTS_same: 12,
    sendFMS_one: 14,
    sendFMS_same: 14,
  }
  const maximum = subjectOverloads[method]
  if (maximum !== undefined && args.length <= maximum) return [...args.slice(0, 4), undefined, ...args.slice(4)]
  if (method === 'search' && args.length === 11) return [...args.slice(0, 10), '', args[10]]
  return args
}
