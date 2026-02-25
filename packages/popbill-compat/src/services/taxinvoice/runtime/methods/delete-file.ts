import type {
  TaxInvoiceApiResponseBase,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import {
  validateFileId,
} from '../../../../internal/validation'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestDeleteFile(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  fileID: string,
  userId: string,
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const fileIdError = validateFileId(fileID)
  if (fileIdError) {
    throw fileIdError
  }

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}/Files/${fileID}`,
    corpNum,
    userId,
    method: 'DELETE',
  })
}
