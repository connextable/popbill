import { normalizePopbillError } from '@connextable/popbill-compat/errors'
import { invokeUserCallback } from '@connextable/popbill-utils'
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
    const throwableError = Object.assign(new Error(normalizedError.message), normalizedError)
    invokeUserCallback(context.onError, throwableError)
    throw throwableError
  }
}
