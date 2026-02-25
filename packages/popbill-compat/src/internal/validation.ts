import { isBlank } from '@connextable/popbill-core'
import type { TaxInvoiceGetUrlTogo, TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'
import { createLegacyValidationError, type LegacyCompatError } from './errors'

export function validateCorpNum(corpNum: string): LegacyCompatError | undefined {
  if (isBlank(corpNum)) {
    return createLegacyValidationError('팝빌회원 사업자번호가 입력되지 않았습니다.')
  }

  return undefined
}

export function validateTaxInvoiceKeyType(keyType: string): LegacyCompatError | undefined {
  if (isBlank(keyType)) {
    return createLegacyValidationError('문서번호유형이 입력되지 않았습니다.')
  }

  if (!isTaxInvoiceKeyType(keyType)) {
    return createLegacyValidationError('문서번호유형이 올바르지 않습니다.')
  }

  return undefined
}

export function validateMgtKey(mgtKey: string): LegacyCompatError | undefined {
  if (isBlank(mgtKey)) {
    return createLegacyValidationError('문서번호가 입력되지 않았습니다.')
  }

  return undefined
}

export function validateMgtKeyList(mgtKeyList: string[]): LegacyCompatError | undefined {
  if (isBlank(mgtKeyList)) {
    return createLegacyValidationError('문서번호배열이 입력되지 않았습니다.')
  }

  return undefined
}

export function validateTaxinvoiceTogo(togo: string): LegacyCompatError | undefined {
  if (isBlank(togo)) {
    return createLegacyValidationError('접근 메뉴가 입력되지 않았습니다.')
  }

  if (!isTaxinvoiceTogo(togo)) {
    return createLegacyValidationError('접근 메뉴가 올바르지 않습니다.')
  }

  return undefined
}

function isTaxInvoiceKeyType(value: string): value is TaxInvoiceMgtKeyType {
  return value === 'SELL' || value === 'BUY' || value === 'TRUSTEE'
}

function isTaxinvoiceTogo(value: string): value is TaxInvoiceGetUrlTogo {
  return value === 'TBOX'
    || value === 'SWBOX'
    || value === 'SBOX'
    || value === 'PWBOX'
    || value === 'PBOX'
    || value === 'WRITE'
}
