/**
 * 예외 객체를 사용자 친화적인 메시지 문자열로 정규화합니다.
 */
export function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as NodeJS.ErrnoException).code
    return `${code ?? ''} ${error.message}`.trim()
  }

  return String(error)
}
