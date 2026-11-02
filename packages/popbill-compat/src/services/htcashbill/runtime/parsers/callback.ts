type Callback = (response: unknown) => void

export function parseCallbackArguments(args: unknown[]): { requestArgs: unknown[]; success?: Callback; error?: Callback } {
  const index = args.findIndex((value) => typeof value === 'function')
  if (index < 0) return { requestArgs: args }
  const first = args[index] as Callback
  const next = args[index + 1]
  if (index + 1 < args.length)
    return { requestArgs: args.slice(0, index), success: first, error: typeof next === 'function' ? (next as Callback) : undefined }
  if (index > 0 && args[index - 1] === undefined) return { requestArgs: args.slice(0, index - 1), error: first }
  return { requestArgs: args.slice(0, index), success: first }
}
