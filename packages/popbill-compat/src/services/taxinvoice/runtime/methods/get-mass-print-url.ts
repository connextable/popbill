import type {
  TaxInvoiceGetMassPrintUrlApiResponse,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import {
  validateMgtKeyList,
} from '@/internal/validation'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestGetMassPrintUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKeyList: string[],
  userId: string,
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType)

  const mgtKeyListError = validateMgtKeyList(mgtKeyList)
  if (mgtKeyListError) {
    throw mgtKeyListError
  }

  const response = await context.requestClient.requestJson<TaxInvoiceGetMassPrintUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}?Print`,
    corpNum,
    userId,
    method: 'POST',
    body: JSON.stringify(mgtKeyList),
  })

  return response.url
}
