import type * as Spec from '@connextable/popbill-spec'


/**
 * 문서번호 유형 상수.
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#Search
 */
export const MgtKeyType: Record<'SELL' | 'BUY' | 'TRUSTEE', Spec.TaxInvoiceMgtKeyType> = {
  SELL: 'SELL',
  BUY: 'BUY',
  TRUSTEE: 'TRUSTEE',
}

/**
 * 문자 발송유형.
 */
export const MessageType = {
  SMS: 'SMS',
  LMS: 'LMS',
  MMS: 'MMS',
} as const

/**
 * 카카오 발송유형.
 */
export const KakaoType = {
  ATS: 'ATS',
  FTS: 'FTS',
  FMS: 'FMS',
} as const
