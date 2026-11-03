import { parseSafeInteger } from '@connextable/popbill-utils'

/** Normalize decimal status codes without turning blank or future provider values into zero or NaN. */
export function preserveNumericCode<T extends number | string | null | undefined>(value: T): number | T {
  if (typeof value !== 'string') return value
  return parseSafeInteger(value) ?? value
}
