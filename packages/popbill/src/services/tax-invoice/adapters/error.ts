import { normalizePopbillError } from '@connextable/popbill-compat/errors'
import type { PopbillApiError } from '@/errors'

/**
 * TaxInvoice facade 메서드 공통 에러 처리 컨텍스트입니다.
 */
export interface TaxInvoiceErrorHandlingContext {
  onError?: (error: PopbillApiError) => void
}

/**
 * TaxInvoice facade 메서드를 실행하고 예외를 `PopbillApiError`로 표준화합니다.
 */
export async function invokeTaxInvoiceMethod<T>(context: TaxInvoiceErrorHandlingContext, operation: string, handler: () => Promise<T>): Promise<T> {
  try {
    return await handler()
  } catch (error) {
    const normalizedError = normalizePopbillError(error, { operation })
    const throwableError = toThrowablePopbillError(normalizedError)
    safelyDispatchError(context.onError, throwableError)
    throw throwableError
  }
}

/**
 * 에러 훅이 예외를 던져도 원래 API 에러를 보존하기 위해 안전하게 호출합니다.
 */
function safelyDispatchError(handler: ((error: PopbillApiError) => void) | undefined, error: PopbillApiError): void {
  if (!handler) {
    return
  }

  try {
    handler(error)
  } catch {
    // onError 훅 예외는 삼켜서 원래 API 에러를 유지합니다.
  }
}

function toThrowablePopbillError(error: PopbillApiError): Error & PopbillApiError {
  return Object.assign(new Error(error.message), error)
}
