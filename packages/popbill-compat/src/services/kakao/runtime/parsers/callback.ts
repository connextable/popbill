export { parseCallbackArguments } from '@/internal/callback-arguments'

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
