import { isBlank } from '@connextable/popbill-utils'
import { createLegacyValidationError, type LegacyCompatError } from './errors'
import type * as Spec from '@connextable/popbill-spec'

const TAX_INVOICE_EMAIL_TYPES = new Set([
  'ETC_CERT_EXPIRATION',
  'TAX_CANCEL_ISSUE',
  'TAX_CANCEL_REQUEST',
  'TAX_CHECK',
  'TAX_CLOSEDOWN',
  'TAX_ISSUE',
  'TAX_ISSUE_INVOICER',
  'TAX_NTSFAIL_INVOICER',
  'TAX_REFUSE',
  'TAX_REQUEST',
  'TAX_TRUST_CANCEL_ISSUE',
  'TAX_TRUST_CANCEL_ISSUE_INVOICER',
  'TAX_TRUST_ISSUE',
  'TAX_TRUST_ISSUE_INVOICER',
  'TAX_TRUST_ISSUE_TRUSTEE',
])

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

export function validateTaxinvoicePayload(taxinvoice: unknown): LegacyCompatError | undefined {
  if (isBlank(taxinvoice)) {
    return createLegacyValidationError('세금계산서 정보가 입력되지 않았습니다.')
  }

  return undefined
}

export function validateSubmitId(submitID: string): LegacyCompatError | undefined {
  if (isBlank(submitID)) {
    return createLegacyValidationError('제출아이디가 입력되지 않았습니다.')
  }

  return undefined
}

export function validateFileId(fileID: string): LegacyCompatError | undefined {
  if (isBlank(fileID)) {
    return createLegacyValidationError('파일아이디가 입력되지 않았습니다.')
  }

  return undefined
}

export function validateItemKey(itemKey: string): LegacyCompatError | undefined {
  if (isBlank(itemKey)) {
    return createLegacyValidationError('아이템키가 입력되지 않았습니다.')
  }

  return undefined
}

export function validateSearchDate(value: string, missingMessage: string, invalidMessage: string): LegacyCompatError | undefined {
  if (isBlank(value)) {
    return createLegacyValidationError(missingMessage)
  }

  if (!isValidDate(value)) {
    return createLegacyValidationError(invalidMessage)
  }

  return undefined
}

export function validateSearchDateType(dType: string): LegacyCompatError | undefined {
  if (isBlank(dType)) {
    return createLegacyValidationError('검색일자 유형이 입력되지 않았습니다.')
  }

  return undefined
}

export function validateAttachFilePath(filePath: unknown): LegacyCompatError | undefined {
  if (typeof filePath !== 'string') {
    return createLegacyValidationError('첨부파일 경로는 문자열만 입력 가능합니다.')
  }

  return undefined
}

export function validateEmailType(emailType: string): LegacyCompatError | undefined {
  if (isBlank(emailType)) {
    return createLegacyValidationError('메일전송타입(EmailType)이 입력되지 않았습니다.')
  }

  if (!TAX_INVOICE_EMAIL_TYPES.has(emailType)) {
    return createLegacyValidationError('메일전송타입(EmailType)이 올바르지 않습니다.')
  }

  return undefined
}

export function validateEmailSendYn(sendYN: boolean): LegacyCompatError | undefined {
  if (isBlank(sendYN)) {
    return createLegacyValidationError('메일전송여부(SendYN)가 입력되지 않았습니다.')
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

function isTaxInvoiceKeyType(value: string): value is Spec.TaxInvoiceMgtKeyType {
  return value === 'SELL' || value === 'BUY' || value === 'TRUSTEE'
}

function isTaxinvoiceTogo(value: string): value is Spec.TaxInvoiceGetUrlTogo {
  return value === 'TBOX' || value === 'SWBOX' || value === 'SBOX' || value === 'PWBOX' || value === 'PBOX' || value === 'WRITE'
}

function isValidDate(value: string): boolean {
  return /^(\d{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/.test(value)
}
