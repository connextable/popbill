/** Observe user hook failures without replacing the original API outcome. */
export function invokeUserCallback<T>(callback: ((value: T) => unknown) | undefined, value: T): void {
  if (!callback) return

  try {
    const result = callback(value)
    if (result && (typeof result === 'object' || typeof result === 'function') && 'then' in result) {
      void Promise.resolve(result).catch(() => undefined)
    }
  } catch {
    // Callback failures do not become API failures.
  }
}
