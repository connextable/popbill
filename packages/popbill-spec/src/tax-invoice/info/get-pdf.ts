import type { TaxInvoiceApiRequest, TaxInvoiceRequireRequestFields } from '../common'

export interface TaxInvoiceGetPdfApiRequestPath {
  /** 현행 영문 HTTP 문서는 매출 문서만 명시한다. */
  MgtKeyType: 'SELL'
  MgtKey: string
}

export interface TaxInvoiceGetPdfApiRequestQuery {
  /** 빈 값 파라미터 `?PDF`. */
  PDF: true
  /** 공급자용 1, 공급받는자용 2. 생략하면 모두 출력한다. */
  PdfInvoiceType?: '1' | '2'
}

/** Source: https://developers.popbill.com/en/api-reference/taxinvoice/api/info#GetPDF */
export type TaxInvoiceGetPdfApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetPdfApiRequestPath, TaxInvoiceGetPdfApiRequestQuery>,
  'path' | 'query'
>

/** JSON 또는 base64 문자열이 아닌 PDF 원본 바이트. */
export type TaxInvoiceGetPdfApiResponse = Uint8Array
