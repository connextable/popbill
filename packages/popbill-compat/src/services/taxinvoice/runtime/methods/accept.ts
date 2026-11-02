import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { encodePathSegment, validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestAccept(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  memo: string,
  userId: string
): Promise<Spec.TaxInvoiceAcceptApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  return context.requestClient.requestJson<Spec.TaxInvoiceAcceptApiResponse>({
    uri: `/Taxinvoice/${keyType}/${encodePathSegment(mgtKey)}`,
    corpNum,
    userId,
    method: 'ACCEPT',
    body: stringifyWithoutEmptyValues({ memo }),
  })
}
