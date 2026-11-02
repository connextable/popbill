import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { encodePathSegment, validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestCancelSend(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  memo: string,
  userId: string
): Promise<Spec.TaxInvoiceCancelSendApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  return context.requestClient.requestJson<Spec.TaxInvoiceCancelSendApiResponse>({
    uri: `/Taxinvoice/${keyType}/${encodePathSegment(mgtKey)}`,
    corpNum,
    userId,
    method: 'CANCELSEND',
    body: stringifyWithoutEmptyValues({ memo }),
  })
}
