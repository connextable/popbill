export function printHeader(message: string): void {
  const line = '='.repeat(84)
  console.log(`\n${line}`)
  console.log(`[${timestamp()}] ${message}`)
  console.log(line)
}

export function logInfo(label: string, payload?: unknown): void {
  if (payload === undefined) {
    console.log(`[${timestamp()}] ${label}`)
    return
  }

  console.log(`[${timestamp()}] ${label}`)
  console.log(toPrettyJson(payload))
}

export function logWarn(label: string, payload?: unknown): void {
  if (payload === undefined) {
    console.warn(`[${timestamp()}] WARN: ${label}`)
    return
  }

  console.warn(`[${timestamp()}] WARN: ${label}`)
  console.warn(toPrettyJson(payload))
}

export function logError(label: string, payload?: unknown): void {
  if (payload === undefined) {
    console.error(`[${timestamp()}] ERROR: ${label}`)
    return
  }

  console.error(`[${timestamp()}] ERROR: ${label}`)
  console.error(toPrettyJson(payload))
}

function toPrettyJson(value: unknown): string {
  try {
    return JSON.stringify(value, jsonReplacer, 2)
  } catch {
    return String(value)
  }
}

function jsonReplacer(_key: string, value: unknown): unknown {
  if (Buffer.isBuffer(value)) {
    return `<Buffer ${value.length} bytes>`
  }

  if (typeof value === 'string' && value.length > 280) {
    return `${value.slice(0, 280)}...(truncated)`
  }

  return value
}

function timestamp(): string {
  return new Date().toISOString()
}
