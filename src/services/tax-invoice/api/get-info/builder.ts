import { fetchJson } from '@/internal/http/fetch-json'
import { isBlank } from '@/utils/validation'
import { createInputValidationError, normalizePopbillError, type PopbillApiError } from '@/errors'
import type { CreateGetTaxInvoiceInfoInput, TaxInvoiceGetInfoInput, TaxInvoiceInfo } from './type'
import type { TaxInvoiceInfoApiResponse } from './spec'
import type { TaxInvoiceKeyType } from '../spec'
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

    let sessionToken: string

    try {
      const token = await input.tokenProvider.getToken(request.businessNumber)
      sessionToken = token.sessionToken
    }
    catch (error) {
      return throwMappedError(error, input.defaultErrorHandler, 'issue_token')
    }

    const resourcePath = `/Taxinvoice/${request.invoiceKeyType}/${request.invoiceManagementKey}`

    try {
      const apiResponse = await fetchJson<TaxInvoiceInfoApiResponse>(
        `${input.apiBaseUrl}${resourcePath}`,
        {
          method: 'GET',
          headers: buildGetInfoHeaders(sessionToken, request.userId),
        },
        { timeoutMs: input.timeoutMs },
      )
      return mapTaxInvoiceInfo(apiResponse)
    }
    catch (error) {
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

function isTaxInvoiceKeyType(value: string): value is TaxInvoiceKeyType {
  return value === 'SELL' || value === 'BUY' || value === 'TRUSTEE'
}

function buildGetInfoHeaders(sessionToken: string, userId: string | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json;charset=utf-8',
    'User-Agent': 'NODEJS POPBILL SDK',
  }

  if (!isBlank(userId)) {
    headers['x-pb-userid'] = userId as string
  }

  return headers
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
