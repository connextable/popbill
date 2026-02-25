import { promises as fs } from 'node:fs'
import { stringifyWithoutEmptyValues } from '@connextable/popbill-core'
import type {
  TaxInvoiceApiResponseBase,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { createLegacyValidationError } from '../../../../internal/errors'
import {
  validateAttachFilePath,
} from '../../../../internal/validation'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'
import { buildSingleFileMultipartPayload } from './multipart'

export async function requestAttachFile(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  displayName: string,
  filePath: string,
  userId: string,
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const filePathError = validateAttachFilePath(filePath)
  if (filePathError) {
    throw filePathError
  }

  let fileData: Buffer
  try {
    fileData = await fs.readFile(filePath)
  }
  catch {
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

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}/Files`,
    corpNum,
    userId,
    method: 'POST',
    body: multipartBody,
    contentType: payload.contentType,
  })
}
