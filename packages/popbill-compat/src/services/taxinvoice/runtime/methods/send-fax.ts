import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestSendFax(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  sender: string,
  receiver: string,
  userId: string
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'FAX',
    body: stringifyWithoutEmptyValues({ sender, receiver }),
  })
}
