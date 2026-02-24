import { fetchJson } from '@/internal/http/fetch-json'
import { isBlank } from '@/utils/validation'
import type { PopbillApiError } from '@/client/types'
import { normalizeErrorMessage } from '@/utils/crypto'
import { mapTaxInvoiceInfo } from './mapper'
import type { CreateGetTaxInvoiceInfoInput, TaxInvoiceGetInfoInput, TaxInvoiceInfo } from './type'
import type { TaxInvoiceInfoApiResponse } from './spec'
import type { TaxInvoiceKeyType } from '../spec'

export function createGetTaxInvoiceInfo(input: CreateGetTaxInvoiceInfoInput) {
  async function getInfo(request: TaxInvoiceGetInfoInput): Promise<TaxInvoiceInfo> {
    validateGetInfoRequest(request)

    const token = await input.tokenProvider.getToken(request.businessNumber)
    const resourcePath = `/Taxinvoice/${request.invoiceKeyType}/${request.invoiceManagementKey}`

    try {
      const apiResponse = await fetchJson<TaxInvoiceInfoApiResponse>(
        `${input.apiBaseUrl}${resourcePath}`,
        {
          method: 'GET',
          headers: buildGetInfoHeaders(token.sessionToken, request.userId),
        },
        { timeoutMs: input.timeoutMs },
      )
      return mapTaxInvoiceInfo(apiResponse)
    }
    catch (error) {
      const popbillError = mapToPopbillApiError(error)
      input.defaultErrorHandler?.(popbillError)
      throw popbillError
    }
  }

  return getInfo
}

function validateGetInfoRequest(request: TaxInvoiceGetInfoInput): void {
  if (isBlank(request.businessNumber)) {
    throw createInputError('팝빌회원 사업자번호가 입력되지 않았습니다.')
  }

  if (isBlank(request.invoiceManagementKey)) {
    throw createInputError('문서번호가 입력되지 않았습니다.')
  }

  if (!isTaxInvoiceKeyType(request.invoiceKeyType)) {
    throw createInputError('문서번호유형이 올바르지 않습니다.')
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

function mapToPopbillApiError(error: unknown): PopbillApiError {
  if (isPopbillApiError(error)) {
    return error
  }

  if (isHttpErrorPayload(error) && isApiErrorBody(error.body)) {
    return {
      code: error.body.code,
      message: error.body.message,
      status: error.status,
      raw: error.body,
    }
  }

  if (isHttpErrorPayload(error)) {
    return {
      code: -99999999,
      message: `HTTP ${error.status}`,
      status: error.status,
      raw: error.body,
    }
  }

  return {
    code: -99999999,
    message: normalizeErrorMessage(error),
    raw: error,
  }
}

function isHttpErrorPayload(payload: unknown): payload is { status: number, body: unknown } {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  return 'status' in payload && 'body' in payload
}

function isApiErrorBody(payload: unknown): payload is { code: number, message: string } {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  if (!('code' in payload) || !('message' in payload)) {
    return false
  }

  return typeof (payload as { code: unknown }).code === 'number'
    && typeof (payload as { message: unknown }).message === 'string'
}

function isPopbillApiError(payload: unknown): payload is PopbillApiError {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  return 'code' in payload && 'message' in payload
}

function createInputError(message: string): PopbillApiError {
  return {
    code: -99999999,
    message,
  }
}
