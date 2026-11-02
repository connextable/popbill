import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

export interface TaxInvoiceGetPdfApiRequestPath {
  /** 공식 Node SDK의 문서번호 유형. 영문 HTTP 예시에는 SELL만 표시된다. */
  MgtKeyType: TaxInvoiceMgtKeyType
  MgtKey: string
}

export interface TaxInvoiceGetPdfApiRequestQuery {
  /** 빈 값 파라미터 `?PDF`. */
  PDF: true
  /** 공급자용 1, 공급받는자용 2. 생략하면 모두 출력한다. */
  PdfInvoiceType?: '1' | '2'
}

/**
 * Sources:
 * - https://developers.popbill.com/en/api-reference/taxinvoice/api/info#GetPDF
 * - https://github.com/linkhub-sdk/node-popbill/blob/master/lib/TaxinvoiceService.js
 */
export type TaxInvoiceGetPdfApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetPdfApiRequestPath, TaxInvoiceGetPdfApiRequestQuery>,
  'path' | 'query'
>

/** JSON 또는 base64 문자열이 아닌 PDF 원본 바이트. */
export type TaxInvoiceGetPdfApiResponse = Uint8Array
