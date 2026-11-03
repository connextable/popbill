/**
 * 예외 객체를 사용자 친화적인 메시지 문자열로 정규화합니다.
 */
export function normalizeErrorMessage(error: unknown): string {
  try {
    if (error instanceof Error) {
      const code = (error as NodeJS.ErrnoException).code
      return `${code ?? ''} ${error.message}`.trim()
    }

    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
      return error.message
    }

    return String(error)
  } catch {
    // Formatting a failure must not replace its original cause with another exception.
    return 'Unknown error'
  }
}
