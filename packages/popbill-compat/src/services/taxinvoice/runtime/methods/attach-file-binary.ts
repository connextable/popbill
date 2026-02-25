import type {
  TaxInvoiceApiResponseBase,
  TaxInvoiceAttachFileBinaryPayload,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import {
  validateTaxinvoicePayload,
} from '@/internal/validation'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import { buildSingleFileMultipartPayload } from './multipart'

export async function requestAttachFileBinary(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  binaryFile: TaxInvoiceAttachFileBinaryPayload,
  userId: string,
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const binaryFileError = validateTaxinvoicePayload(binaryFile)
  if (binaryFileError) {
    throw binaryFileError
  }

  const payload = buildSingleFileMultipartPayload({
    filePathOrName: binaryFile.fileName,
    fileData: binaryFile.fileData,
    formData: '',
  })
  const multipartBody = new Uint8Array(payload.body)

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}/Files`,
    corpNum,
    userId,
    method: 'POST',
    body: multipartBody,
    contentType: payload.contentType,
  })
}
