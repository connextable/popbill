import type {
  TaxInvoiceGetInfosApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import {
  validateMgtKeyList,
} from '../../../../internal/validation'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestGetInfos(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKeyList: string[],
  userId: string,
): Promise<TaxInvoiceGetInfosApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType)

  const mgtKeyListError = validateMgtKeyList(mgtKeyList)
  if (mgtKeyListError) {
    throw mgtKeyListError
  }

  return context.requestClient.requestJson<TaxInvoiceGetInfosApiResponse>({
    uri: `/Taxinvoice/${keyType}`,
    corpNum,
    userId,
    method: 'POST',
    body: JSON.stringify(mgtKeyList),
  })
}
