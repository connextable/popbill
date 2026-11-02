import { Buffer } from 'node:buffer'
import { encodePathSegment, validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'

export async function requestGetPdf(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string,
  pdfInvoiceType?: Spec.TaxInvoiceGetPdfApiRequestQuery['PdfInvoiceType']
): Promise<Buffer> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  if (pdfInvoiceType !== undefined && pdfInvoiceType !== '1' && pdfInvoiceType !== '2') {
    throw createLegacyValidationError('PDF 출력유형이 올바르지 않습니다. 공급자용 1 또는 공급받는자용 2를 입력하세요.')
  }
  const copyQuery = pdfInvoiceType === undefined ? '' : `&PdfInvoiceType=${pdfInvoiceType}`
  const bytes = await context.requestClient.requestBinary({
    uri: `/Taxinvoice/${keyType}/${encodePathSegment(mgtKey)}?PDF${copyQuery}`,
    corpNum,
    userId,
    method: 'GET',
  })
  return Buffer.from(bytes)
}
