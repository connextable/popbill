import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { encodePathSegment, validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestDeny(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  memo: string,
  userId: string
): Promise<Spec.TaxInvoiceDenyApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  return context.requestClient.requestJson<Spec.TaxInvoiceDenyApiResponse>({
    uri: `/Taxinvoice/${keyType}/${encodePathSegment(mgtKey)}`,
    corpNum,
    userId,
    method: 'DENY',
    body: stringifyWithoutEmptyValues({ memo }),
  })
}
