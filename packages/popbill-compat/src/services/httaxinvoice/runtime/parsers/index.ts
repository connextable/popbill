export function parseCallbackArguments(args: unknown[]): {
  requestArgs: unknown[]
  success?: (value: unknown) => void
  error?: (value: unknown) => void
} {
  const index = args.findIndex((value) => typeof value === 'function')
  if (index < 0) return { requestArgs: args }
  const callback = args[index] as (value: unknown) => void
  if (index + 1 < args.length)
    return {
      requestArgs: args.slice(0, index),
      success: callback,
      error: typeof args[index + 1] === 'function' ? (args[index + 1] as (value: unknown) => void) : undefined,
    }
  if (index > 0 && args[index - 1] === undefined) return { requestArgs: args.slice(0, index - 1), error: callback }
  return { requestArgs: args.slice(0, index), success: callback }
}
