import { isPopbillRequestStageError } from '@/internal/popbill'
import { isBlank } from '@/utils/validation'
import { createInputValidationError, normalizePopbillError, type PopbillApiError } from '@/errors'
import type { CreateGetTaxInvoiceInfoInput, TaxInvoiceGetInfoInput, TaxInvoiceInfo } from './type'
import type { TaxInvoiceGetInfoApiResponse } from '@connextable/popbill-spec'
import type { TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'
import { mapTaxInvoiceInfo } from './mapper'

const OPERATION_NAME = 'taxInvoice.getInfo' as const

export function createGetTaxInvoiceInfo(input: CreateGetTaxInvoiceInfoInput) {
  async function getInfo(request: TaxInvoiceGetInfoInput): Promise<TaxInvoiceInfo> {
    try {
      validateGetInfoRequest(request)
    }
    catch (error) {
      return throwMappedError(error, input.defaultErrorHandler, 'validate_input')
    }

    const resourcePath = `/Taxinvoice/${request.invoiceKeyType}/${request.invoiceManagementKey}`

    try {
      const apiResponse = await input.requestClient.requestJson<TaxInvoiceGetInfoApiResponse>({
        uri: resourcePath,
        corpNum: request.businessNumber,
        userId: request.userId,
        method: 'GET',
      })
      return mapTaxInvoiceInfo(apiResponse)
    }
    catch (error) {
      if (isPopbillRequestStageError(error)) {
        return throwMappedError(error.cause, input.defaultErrorHandler, error.requestStage)
      }

      return throwMappedError(error, input.defaultErrorHandler, 'request_api')
    }
  }

  return getInfo
}

function validateGetInfoRequest(request: TaxInvoiceGetInfoInput): void {
  if (isBlank(request.businessNumber)) {
    throw createInputValidationError('팝빌회원 사업자번호가 입력되지 않았습니다.')
  }

  if (isBlank(request.invoiceManagementKey)) {
    throw createInputValidationError('문서번호가 입력되지 않았습니다.')
  }

  if (!isTaxInvoiceKeyType(request.invoiceKeyType)) {
    throw createInputValidationError('문서번호유형이 올바르지 않습니다.')
  }
}

function isTaxInvoiceKeyType(value: string): value is TaxInvoiceMgtKeyType {
  return value === 'SELL' || value === 'BUY' || value === 'TRUSTEE'
}

function throwMappedError(
  error: unknown,
  defaultErrorHandler: ((error: PopbillApiError) => void) | undefined,
  stage: 'validate_input' | 'issue_token' | 'request_api',
): never {
  const popbillError = normalizePopbillError(error, {
    operation: OPERATION_NAME,
    stage,
  })
  defaultErrorHandler?.(popbillError)
  throw popbillError
}
