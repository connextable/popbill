/** Normalize decimal status codes without turning blank or future provider values into zero or NaN. */
export function preserveNumericCode<T extends number | string | null | undefined>(value: T): number | T {
  if (typeof value !== 'string' || !/^[+-]?\d+$/.test(value)) return value
  const numeric = Number(value)
  return Number.isSafeInteger(numeric) ? numeric : value
}
