import { encodePathSegment, validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetOldPrintUrl(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  userId: string
): Promise<string> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  const response = await context.requestClient.requestJson<Spec.TaxInvoiceGetOldPrintUrlApiResponse>({
    uri: `/Taxinvoice/${keyType}/${encodePathSegment(mgtKey)}?TG=PRINTOLD`,
    corpNum,
    userId,
    method: 'GET',
  })
  return response.url
}
