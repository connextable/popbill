import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { encodePathSegment, validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSend(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  mgtKey: string,
  memo: string,
  emailSubject: string,
  userId: string
): Promise<Spec.TaxInvoiceSendApiResponse> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  return context.requestClient.requestJson<Spec.TaxInvoiceSendApiResponse>({
    uri: `/Taxinvoice/${keyType}/${encodePathSegment(mgtKey)}`,
    corpNum,
    userId,
    method: 'SEND',
    body: stringifyWithoutEmptyValues({ memo, emailSubject }),
  })
}
