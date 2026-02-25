import { stringifyWithoutEmptyValues } from '@connextable/popbill-core'
import type {
  TaxInvoiceApiResponseBase,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '../common'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestCancelIssue(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  memo: string,
  userId: string,
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'CANCELISSUE',
    body: stringifyWithoutEmptyValues({ memo }),
  })
}
