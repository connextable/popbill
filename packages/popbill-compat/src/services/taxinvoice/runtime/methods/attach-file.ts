import { promises as fs } from 'node:fs'
import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateAttachFilePath } from '@/internal/validation'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import { buildSingleFileMultipartPayload } from './multipart'
import type * as Spec from '@connextable/popbill-spec'

export async function requestAttachFile(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  displayName: string,
  filePath: string,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const filePathError = validateAttachFilePath(filePath)
  if (filePathError) {
    throw filePathError
  }

  let fileData: Buffer
  try {
    fileData = await fs.readFile(filePath)
  } catch {
    throw createLegacyValidationError(`파일을 읽을 수 없습니다. [${filePath}]`)
  }

  const requestBody = stringifyWithoutEmptyValues({
    DisplayName: displayName,
  })

  const payload = buildSingleFileMultipartPayload({
    filePathOrName: filePath,
    fileData,
    displayName,
    formData: requestBody,
  })
  const multipartBody = new Uint8Array(payload.body)

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}/Files`,
    corpNum,
    userId,
    method: 'POST',
    body: multipartBody,
    contentType: payload.contentType,
  })
}
